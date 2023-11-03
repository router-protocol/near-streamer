import { Collection, Db, MongoClient } from 'mongodb'
import { MONGO_DB_URI } from '../../constant';
import logger from '../../logger';

// Connection URL
const client = new MongoClient(MONGO_DB_URI);

// Database Name
const dbName = 'near-streamer';

export let DBInstance: Db;

async function initializeMongoDB(): Promise<Db> {
    try {
        logger.info(`Connecting to MongoDB - ${MONGO_DB_URI}`);
        await client.connect();
        logger.info(`Connected to MongoDB Server`);
        DBInstance = client.db(dbName);
        return DBInstance;
    } catch (error) {
        logger.error(`Error occurred - ${error}`);
    }
}

async function getCollection(collectionName: string): Promise<Collection<Document>> {
    try {
        return DBInstance.collection(collectionName);
    } catch (error) {
        logger.error(`Error occurred getting collection ${collectionName} - ${error}`);
    }
}

export { initializeMongoDB, getCollection };