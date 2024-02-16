import express, { Request, Response } from 'express';
import cors from 'cors';
import * as path from 'path';
import "./streamer"
import logger from './logger';
// import { initializeDB } from './db/dbConnector';
import { startStreamService } from './streamer';
import { fetchLogs } from './routes/fetchLogs';
import { healthCheck } from './routes/healthCheck';
import "./constant"
import { DBInstance, initializeMongoDB } from './db/mongoDB';
import { healthCheckService } from './utils/healthCheckService';
import { ALERTER_ACTIVE } from './constant';
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 6900;

// Enable CORS for all routes
app.use(cors());


app.get('/', (req: Request, res: Response) => {
    res.send('Stream service is running, do /health for health check');
});

app.use('/', fetchLogs);
app.use('/', healthCheck);


// Checks for --custom and if it has a value
const customIndex = process.argv.indexOf('--custom');
let customValue;

if (customIndex > -1) {
    // Retrieve the value after --custom
    customValue = process.argv[customIndex + 1];
}

const custom = (customValue || 'default');


async function main() {
    try {
        await initializeMongoDB();
        app.listen(PORT, () => {
            logger.info(`Server is running on http://localhost:${PORT}`);
        });
        console.log("custom", custom)
        if (custom !== "only-server") {
            startStreamService();
        }
    } catch (error) {
        logger.error(`Error occurred - ${error}`);
    }
}
main();
let continousAlerts = 1;
if (ALERTER_ACTIVE) {
    setInterval(async () => {
        // do health check every 5 minutes
        if (!DBInstance) {
            const alerted = await healthCheckService();
            if (alerted) {
                continousAlerts++;
            } else {
                continousAlerts = 1;
            }
        }
    }, continousAlerts * 5 * 60 * 1000);
}
