import logger from "../../../logger";
import { mongoDbInstance } from "../models";
import { CHAIN_STATE } from "../models/chainState";
// import { CHAIN_STATE } from "../db/mongoDB/models/ChainState.model";

export class ChainStateActions {
    async removeAllStates() {
        // implementation using MongoDB client
        await mongoDbInstance.ChainState.deleteMany({}).exec();
    }
    async getLastSyncedBlock(): Promise<null | number> {
        // implementation using MongoDB client
        const record = await mongoDbInstance.ChainState.findOne({
            id: CHAIN_STATE,
        }).exec();
        return record?.lastSyncedBlock ?? null;
    }

    async updateLastUpdatedBlock(block: number): Promise<any> {
        // implementation using MongoDB client
        try {
            const state = await mongoDbInstance.ChainState.findOne({
                id: CHAIN_STATE,
            }).exec();
            if (state) {
                // If the state already exists, update its value with the new value
                return await mongoDbInstance.ChainState.findOneAndUpdate(
                    { id: CHAIN_STATE },
                    {
                        $set: {
                            lastSyncedBlock: block
                        }
                    }
                ).exec();
            } else {
                // If the state doesn't exist, create a new state document with the key and value
                return await mongoDbInstance.ChainState.create({
                    id: CHAIN_STATE,
                    lastSyncedBlock: block,
                });
            }
        } catch (error) {
            throw new Error(`Error occurred Updating LastUpdatedBlock - ${error}`);
        }
    }
}
