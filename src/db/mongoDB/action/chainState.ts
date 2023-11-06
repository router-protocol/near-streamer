import { Collection } from 'mongodb'


export async function updateLastUpdatedBlock(collection: Collection<Document>, block: number): Promise<void> {
    try {
        const result: any = await collection.findOne(
            { id: "CHAIN_STATE" }
        );
        if (!result) {
            await collection.insertOne({
                id: "CHAIN_STATE",
                lastSyncedBlock: block,
            } as any);
        } else {
            if (result?.lastSyncedBlock > block) {
                return;
            }
            await collection.updateOne(
                { id: "CHAIN_STATE" },
                {
                    $set: {
                        lastSyncedBlock: block,
                    },
                }
            );
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