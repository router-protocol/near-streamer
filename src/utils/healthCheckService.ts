import { NEAR_TESTNET_CONFIG, NETWORK } from "../constant";
import { getCollection } from "../db/mongoDB";
import { getLastSyncedBlock } from "../db/mongoDB/action/chainState";
import logger from "../logger";
import sendAlertToSlack from "./sendAlertToSlack";
const nearAPI = require("near-api-js");
const { connect } = nearAPI;

export const healthCheckService: () => Promise<boolean> = async () => {

    try {

        const nearConnection = await connect(NEAR_TESTNET_CONFIG);
        const latestBlockHeight: number = await nearConnection.connection.provider.status().then((status) => {
            return status.sync_info.latest_block_height;
        });
        // sanity check for startBlock and endBlock
        const chainstatescollection = await getCollection("chainstates");
        const lastSyncedBlock = await getLastSyncedBlock(chainstatescollection);

        const difference = lastSyncedBlock - latestBlockHeight;
        let message = `NEAR ${NETWORK.toUpperCase()} Streamer is ${Math.abs(difference)} blocks ${difference < 0 ? "behind" : "ahead"} of NEAR Testnet.`;
        logger.info(message);
        message += ` Last synced block: ${lastSyncedBlock} Latest block: ${latestBlockHeight}`;
        logger.info(`Last synced block: ${lastSyncedBlock} Latest block: ${latestBlockHeight}`);
        if (difference < -30) {
            sendAlertToSlack(message);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error fetching data:', error);
        return false;
    }
}