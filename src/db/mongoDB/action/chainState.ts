import { Collection } from 'mongodb'


export async function updateLastUpdatedBlock(collection: Collection<Document>, block: number): Promise<void> {
    try {
        const result = await collection.findOneAndUpdate(
            { id: "CHAIN_STATE" },
            {
                $set: {
                    lastSyncedBlock: block
                }
            }
        );
        if (!result) {
            await collection.insertOne({
                id: "CHAIN_STATE",
                lastSyncedBlock: block,
            } as any);
        }
    } catch (error) {
        console.error(error);
    }
}

export async function getLastSyncedBlock(collection: Collection<Document>): Promise<number> {
    try {
        const result: any = await collection.findOne({ id: "CHAIN_STATE" });
        return result?.lastSyncedBlock ?? 0;
    } catch (error) {
        console.error(error);
        return 0;
    }
}