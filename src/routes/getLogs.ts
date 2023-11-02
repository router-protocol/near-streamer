import { Router, Request, Response } from 'express';
import { EventLogActions } from '../db/mongoDB/actions/eventLog';
import logger from '../logger';

const fetchLogs = Router();

fetchLogs.get('/fetch-logs', async (req: Request, res: Response) => {
    try {
        // sanity check for startBlock and endBlock
        const reqStartBlock = req.query.startBlock
        const reqEndBlock = req.query.endBlock
        if (isNaN(Number(reqStartBlock))) {
            res.status(400).json({ success: false, message: 'Invalid startBlock' });
            return;
        }
        if (isNaN(Number(reqEndBlock))) {
            res.status(400).json({ success: false, message: 'Invalid endBlock' });
            return;
        }
        // @ts-ignore
        const startBlock = (parseInt(reqStartBlock)) ?? 0;
        // @ts-ignore
        const endBlock = (parseInt(reqEndBlock)) ?? 0;
        logger.info(`Fetching logs from block ${startBlock} to ${endBlock}`);
        const result = await new EventLogActions().getLogsFromBlockHeightToBlockHeight(startBlock, endBlock);
        res.json(result);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

export { fetchLogs };