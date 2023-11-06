import { Router, Request, Response } from 'express';
// import { BlocklogActions } from '../db/mongoDB/actions/blocklog';
import logger from '../logger';
import { getLogsFromBlockHeightToBlockHeight } from '../db/mongoDB/action/blockLog';
import { getCollection } from '../db/mongoDB';
import { CONTRACTS_TO_TRACK } from '../constant';

const fetchLogs = Router();

fetchLogs.get('/fetch-logs', async (req: Request, res: Response) => {
    try {
        // sanity check for startBlock and endBlock
        const reqStartBlock = req.query.startBlock
        const reqEndBlock = req.query.endBlock
        const reqLimit = req.query.numOfBlocks
        const reqContract = req.query.contract
        if (isNaN(Number(reqStartBlock))) {
            res.status(400).json({ success: false, message: 'Invalid startBlock' });
            return;
        }

        if (typeof reqContract === "string" && reqContract === "" && CONTRACTS_TO_TRACK.includes(reqContract.toLowerCase())) {
            res.status(400).json({ success: false, message: 'Invalid Contract Address' });
            return;
        }
        // @ts-ignore
        const startBlock = (parseInt(reqStartBlock)) ?? 0;
        // @ts-ignore
        const endBlock = (parseInt(reqEndBlock)) ?? undefined;
        // @ts-ignore
        const limit = (parseInt(reqLimit)) ?? undefined;
        logger.info(`Fetching logs from block ${startBlock} to ${endBlock}`);
        const blocklogscollection = await getCollection("blocklogs_" + reqContract);
        const result = await getLogsFromBlockHeightToBlockHeight(blocklogscollection, {
            startBlock,
            endBlock,
            limit
        });
        res.json(result);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

export { fetchLogs };