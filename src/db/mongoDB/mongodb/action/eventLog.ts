import { Collection, Db, MongoClient, OptionalId } from 'mongodb'
import { IEventLog } from '../types';
import { getEventId } from '../../../../utils';

export async function putNewEventLog(collection: Collection<Document>, eventLog: IEventLog): Promise<void> {
    try {
        const id = getEventId(eventLog);
        const findResult = await collection.find({ id }).toArray();
        if (findResult.length === 0) {
            const data = {
                // id,
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
                }
            } as any
            // const result = await collection.insertOne({} as OptionalId<Document>);
            await collection.insertOne(data);
        }

    } catch (error) {
        console.error(error);
    }
}

export async function getAllEventLogs(collection: Collection<Document>): Promise<IEventLog[]> {
    try {
        const result = await collection.find({}).toArray();
        return result as any;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getLogsFromBlockHeightToBlockHeight(collection: Collection<Document>, startBlock: number, endBlock: number): Promise<IEventLog[]> {
    try {
        const result = await collection.find({
            height: { $gte: startBlock, $lte: endBlock }
        }).toArray();
        return result as any;
    } catch (error) {
        console.error(error);
        return [];
    }
}