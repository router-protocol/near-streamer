import { Collection, ObjectId, } from 'mongodb'
import { IBlocklog } from '../types';
import { getEventId } from '../../../utils';
import { keysToSnakeCase } from '../../../utils/caseConverter';

export async function putNewBlocklog(collection: Collection<Document>, blocklog: {
    height: number,
    blockDump: any,
}): Promise<void> {
    try {
        const findResult = await collection.find({ _id: new ObjectId(blocklog.height) }).toArray();
        if (findResult.length === 0) {
            // const data = {
            //     // id,
            //     blockHash: blocklog.blockHash,
            //     height: blocklog.height,
            //     shardId: blocklog.shardId,
            //     events: blocklog.events,
            //     timestamp: blocklog.timestamp,
            //     gas_burnt: blocklog.gasBrunt,
            //     receipt: {
            //         predecessor_id: blocklog.receipt.predecessorId,
            //         receiver_id: blocklog.receipt.receiverId,
            //         receipt_id: blocklog.receipt.receiptId,
            //     }
            // } as any
            const data = {
                _id: blocklog.height,
                blockDump: blocklog.blockDump
            } as any
            // const result = await collection.insertOne({} as OptionalId<Document>);
            await collection.insertOne(data);
        }

    } catch (error) {
        console.error(error);
    }
}

export async function getAllBlocklogs(collection: Collection<Document>): Promise<IBlocklog[]> {
    try {
        const result = await collection.find({}).toArray();
        return result as any;
    } catch (error) {
        console.error(error);
        return [];
    }
}
export async function getAllBlocklogsAndUpdate(collection: Collection<Document>): Promise<IBlocklog[]> {
    try {
        const result = await collection.find({}).toArray();
        if (result.length != 0) {
            result.forEach(async (blocklog) => {
                // @ts-ignore
                const events = blocklog.blockDump;
                const blockDump = keysToSnakeCase(events);
                await collection.updateOne(
                    { _id: blocklog._id },
                    {
                        $set: {
                            blockDump
                        }
                    }
                );
            }
            )
        }
        return result as any;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getLogsFromBlockHeightToBlockHeight(collection: Collection<Document>, options: {
    startBlock: number, endBlock?: number, limit?: number
}): Promise<IBlocklog[]> {
    try {
        const { startBlock, endBlock, limit } = options;
        const filter = endBlock ? {
            _id: { $gte: startBlock, $lte: endBlock }
        } : {
            _id: { $gte: startBlock }
        }
        // @ts-ignore
        const result = await collection.find(filter, {
            limit,
            sort: { _id: 1 }
        }).toArray();
        console.log(result, collection.collectionName)
        return result as any;
    } catch (error) {
        console.error(error);
        return [];
    }
}