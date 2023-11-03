import express, { Request, Response } from 'express';
import cors from 'cors';
import * as path from 'path';
import "./streamer"
import logger from './logger';
// import { initializeDB } from './db/dbConnector';
import { startStreamService } from './streamer';
import { fetchLogs } from './routes/getLogs';
import { healthCheck } from './routes/healthCheck';
import "./constant"
import { initializeMongoDB } from './db/mongoDB';
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 6900;

// Enable CORS for all routes
app.use(cors());


app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Is this working?');
});

app.use('/', fetchLogs);
app.use('/', healthCheck);





async function main() {
    try {
        // await initializeDB();
        await initializeMongoDB();
        app.listen(PORT, () => {
            logger.info(`Server is running on http://localhost:${PORT}`);
        });
        startStreamService();
    } catch (error) {
        logger.error(`Error occurred - ${error}`);
    }
}
main();