import { Collection, ObjectId, } from 'mongodb'
// import { IBlocklog } from '../types';
import { getEventId } from '../../../utils';
import { keysToSnakeCase } from '../../../utils/caseConverter';
import { Document } from 'mongodb';
import { PRUNE_AFTER } from '../../../constant';
import logger from '../../../logger';

export async function putNewBlocklog(collection: Collection<Document>, blocklog: {
    height: number,
    blockDump: any,
}): Promise<void> {
    try {
        const findResult = await collection.find({ _id: new ObjectId(blocklog.height) }).toArray();
        if (findResult.length === 0) {
            const createdAt = new Date();
            logger.info("createdAt", createdAt);
            const data = {
                _id: blocklog.height,
                blockDump: blocklog.blockDump,
                createdAt // the current date and time
            } as Document;
            // const result = await collection.insertOne({} as OptionalId<Document>);
            await collection.insertOne(data);
        }

    } catch (error) {
        console.error(error);
    }
}

export async function createTTLIndex(collection: Collection<Document>): Promise<void> {
    await collection.createIndex({ "createdAt": 1 }, { expireAfterSeconds: PRUNE_AFTER });
}

export async function getAllBlocklogs(collection: Collection<Document>): Promise<any[]> {
    try {
        const result = await collection.find({}).toArray();
        return result as any;
    } catch (error) {
        console.error(error);
        return [];
    }
}
export async function getAllBlocklogsAndUpdate(collection: Collection<Document>): Promise<any[]> {
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
    startBlock: number, endBlock?: number
}): Promise<any[]> {
    try {
        const { startBlock, endBlock } = options;
        const filter = endBlock ? {
            _id: { $gte: startBlock, $lte: endBlock }
        } : {
            _id: { $gte: startBlock }
        }
        // @ts-ignore
        const result = await collection.find(filter, {
            sort: { _id: 1 }
        }).toArray();
        return result as any;
    } catch (error) {
        console.error(error);
        return [];
    }
}