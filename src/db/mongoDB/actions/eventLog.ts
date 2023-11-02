import { mongoDbInstance } from "../models";
import { EVENT_LOGH } from "../models/eventLog";

interface IEventLog {
    height: number;
    timestamp: number;
    gasBrunt: number;
    blockHash: string;
    shardId: number;
    receipt: {
        predecessorId: string;
        receiverId: string;
        receiptId: string;
    }
    events: string[];
}

export class EventLogActions {
    async removeAllLogs() {
        // implementation using MongoDB client
        await mongoDbInstance.EventLog.deleteMany({}).exec();
    }
    async getAllLogs() {
        // implementation using MongoDB client
        const record = await mongoDbInstance.EventLog.find({}).exec();
        return record;
    }
    async getLogsFromBlockHeightToBlockHeight(startBlock: number, endBlock: number) {
        // implementation using MongoDB client
        const record = await mongoDbInstance.EventLog.find({
            height: { $gte: startBlock, $lte: endBlock }
        }).exec();
        return record;
    }

    async getEventLog(key: string) {
        // implementation using MongoDB client
        const record = await mongoDbInstance.EventLog.findOne({
            id: key,
        }).exec();
        return record;
    }

    async putNewBlock(eventLog: IEventLog): Promise<any> {
        // implementation using MongoDB client
        try {
            const id = getEventId(eventLog);
            const state = await mongoDbInstance.EventLog.findOne({
                id,
            }).exec();
            if (state) {
                // // If the state already exists, update its value with the new value
                // const newState = {
                //     ...state,
                //     lastSyncedBlock: block
                // };
                // await mongoDbInstance.EventLog.findOneAndUpdate(
                //     { id: CHAIN_STATE },
                //     newState
                // ).exec();
            } else {
                // If the state doesn't exist, create a new state document with the key and value
                return await mongoDbInstance.EventLog.create({
                    id,
                    blockHash: eventLog.blockHash,
                    height: eventLog.height,
                    shardId: eventLog.shardId,
                    events: eventLog.events,
                    timestamp: eventLog.timestamp,
                    gas_burnt: eventLog.gasBrunt,
                    receipt: {
                        predecessor_id: eventLog.receipt.predecessorId,
                        receiver_id: eventLog.receipt.receiverId,
                        receipt_id: eventLog.receipt.receiptId,
                    },
                    // receiptId: eventLog.receiptId,
                    // data: eventLog.data,
                });
            }
        } catch (error) {
            throw new Error(`Error occurred Putting BlockLogs - ${error}`);
        }

    }
}

export const getEventId = (eventLog: IEventLog) => {
    return eventLog.height.toString() + eventLog.shardId.toString() + eventLog.receipt.receiptId.toString();
}