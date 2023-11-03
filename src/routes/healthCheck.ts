import { Router, Request, Response } from 'express';
import { getCollection } from '../db/mongoDB';
import { getLastSyncedBlock } from '../db/mongoDB/action/chainState';
// import { ChainStateActions } from '../db/mongoDB/actions/chainState';

const healthCheck = Router();
// const chainStateActions = new ChainStateActions();

healthCheck.get('/health', async (req: Request, res: Response) => {
    try {
        // sanity check for startBlock and endBlock
        const chainstatescollection = await getCollection("chainstates");
        const lastSyncedBlock = await getLastSyncedBlock(chainstatescollection);
        res.json({ success: true, lastSyncedBlock });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

export { healthCheck };