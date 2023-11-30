import { Router, Request, Response } from 'express';
// import { BlocklogActions } from '../db/mongoDB/actions/blocklog';
import logger from '../logger';
import { getLogsFromBlockHeightToBlockHeight } from '../db/mongoDB/action/blockLog';
import { getCollection } from '../db/mongoDB';
import { CONTRACTS_TO_TRACK } from '../streamer';
import { keysToSnakeCase } from '../utils/caseConverter';

const fetchLogs = Router();

fetchLogs.get('/fetch-logs', async (req: Request, res: Response) => {
    try {
        // sanity check for startBlock and endBlock
        const reqStartBlock = Number(req.query.startBlock)
        const reqEndBlock = Number(req.query.endBlock)
        const reqLimit = Number(req.query.numOfBlocks)
        const reqContract = req.query.contract
        // start block is a number
        if (isNaN(reqStartBlock)) {
            res.status(400).json({ success: false, message: 'Invalid startBlock' });
            return;
        }
        // endblock or limit is a number
        if (isNaN(reqLimit) && isNaN(reqEndBlock)) {
            res.status(400).json({ success: false, message: 'Invalid limit or end block' });
            return;
        }

        if (typeof reqContract === "string" && reqContract === "" && CONTRACTS_TO_TRACK.includes(reqContract.toLowerCase())) {
            res.status(400).json({ success: false, message: 'Invalid Contract Address' });
            return;
        }
        const startBlock = reqStartBlock;
        let limit = isNaN(reqLimit) ? 1000 : reqLimit;
        if (limit > 10000) {
            limit = 10000;
        }
        let endBlock = isNaN(reqEndBlock) ? startBlock + limit : reqEndBlock;

        logger.info(`Fetching logs from block ${startBlock} to ${endBlock}`);
        const blocklogscollection = await getCollection("blocklogs_" + reqContract);
        const result = await getLogsFromBlockHeightToBlockHeight(blocklogscollection, {
            startBlock,
            endBlock,
        });
        res.json(keysToSnakeCase(result));
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

export { fetchLogs };