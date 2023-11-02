import { Collection, Db, MongoClient } from 'mongodb'
import { MONGO_DB_URI } from '../../../constant';
import logger from '../../../logger';

// Connection URL
const client = new MongoClient(MONGO_DB_URI);

// Database Name
const dbName = 'near-streamer';

let DB: Db;

async function initializeMongoDB(): Promise<Db> {
    try {
        logger.info(`Connecting to MongoDB - ${MONGO_DB_URI}`);
        await client.connect();
        logger.info(`Connected to MongoDB Server`);
        DB = client.db(dbName);
        return DB;
    } catch (error) {
        logger.error(`Error occurred - ${error}`);
    }
}

async function createCollection(db: Db, collectionName: string): Promise<Collection<Document>> {
    try {
        logger.info(`Created collection ${collectionName}`);
        return db.collection(collectionName);
    } catch (error) {
        logger.error(`Error occurred - ${error}`);
    }
}

export { initializeMongoDB, createCollection };