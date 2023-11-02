import mongoose from "mongoose";
// import { dbEnvironment, NODE_ENV } from "../../config";
// import { CrossChainStateCollection, TransactionCollection } from "../../data-access-layer";
// import { CrossChainState } from "./models/CrossChainState.model";
import logger from "../../logger";
import { MONGO_DB_URI } from "../../constant";

/**
 * Mongoose Connection
 **/

export const initializeMongoDB = async () => {
    try {
        logger.info(`Connecting to MongoDB - ${MONGO_DB_URI}`);
        return await mongoose.connect(
            MONGO_DB_URI,
            {
                dbName: "near-streamer",
                bufferCommands: false, // Disable buffering to set a higher timeout
                family: 4,

            }
        ).then(() => {
            logger.info("Connected to MongoDB");
        }
        ).catch((err) => {
            logger.error(`Error occurred - ${err}`);
            process.exit(1);
        });
    } catch (error) {
        logger.error(`Error occurred - ${error}`);
    }
};

export * from "./models";