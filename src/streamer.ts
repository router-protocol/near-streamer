import { startStream, types } from "near-lake-framework";
import { NEAR_TESTNET_CONFIG as NEAR_CONFIG } from "./constant";
import logger from "./logger";
import { EventLogActions } from "./db/mongoDB/actions/eventLog";
import { ChainStateActions } from "./db/mongoDB/actions/chainState";
import { getLastSyncedBlock, updateLastUpdatedBlock } from "./db/mongoDB/mongodb/action/chainState";
import { createCollection } from "./db/mongoDB/mongodb";
import { Collection, Db } from "mongodb";
import { putNewEventLog } from "./db/mongoDB/mongodb/action/eventLog";

// const FUNDS_PAID = "funds_paid";
// const FUNDS_PAID_WITH_MESSAGE = "funds_paid_with_message";
// const EXECUTE = "execute";
// const TOKEN_TRANSFER = "token_transfer";
// const TOKEN_TRANSFER_WITH_INSTRUCTION = "token_transfer_with_instruction";
// const I_SEND_EVENT = "i_send_event"
// const VALSET_UPDATED_EVENT = "valset_updated_event"
// const SET_DAPP_METADATA_EVENT = "set_dapp_metadata_event"
// const I_RECEIVE_EVENT = "i_receive_event"
// const I_ACK_EVENT = "i_ack_event"
// const FUNDS_DEPOSITED = "funds_deposited"
// const FUNDS_DEPOSITED_WITH_MESSAGE = "funds_deposited_with_message"
// const DEPOSIT_INFO_UPDATE = "deposit_info_update"

const EVENTS_TO_TRACK = ["funds_paid",
    "funds_paid_with_message",
    "execute",
    "token_transfer",
    "token_transfer_with_instruction",
    "i_send_event",
    "valset_updated_event",
    "set_dapp_metadata_event",
    "i_receive_event",
    "i_ack_event",
    "funds_deposited",
    "funds_deposited_with_message",
    "deposit_info_update"]

const lakeConfig: types.LakeConfig = {
    s3BucketName: NEAR_CONFIG.s3BucketName,
    s3RegionName: NEAR_CONFIG.s3RegionName,
    startBlockHeight: NEAR_CONFIG.startBlockHeight,
    blocksPreloadPoolSize: NEAR_CONFIG.blocksPreloadPoolSize,
};

// const chainStateCollObj = new IndividualChainStateCollection();
// const chainStateActions = new ChainStateActions();
// const eventLogActions = new EventLogActions();

export async function handleStreamerMessage(
    streamerMessage: types.StreamerMessage,
    eventlogcollection: Collection<Document>,
    chainStatecollection: Collection<Document>
): Promise<void> {
    logger.info(
        `${NEAR_CONFIG.networkId} Block # Shards: ${JSON.stringify(
            streamerMessage.block.header.height
        )}`
    );
    try {
        for (let k = 0; k < streamerMessage.shards.length; k++) {
            const shard = streamerMessage.shards[k];
            for (let j = 0; j < shard.receiptExecutionOutcomes.length; j++) {

                const rxExOutcome = shard.receiptExecutionOutcomes[j];
                if (
                    rxExOutcome.executionOutcome.outcome.executorId.toLowerCase() ===
                    NEAR_CONFIG.assetForwarder.toLowerCase() ||
                    rxExOutcome.executionOutcome.outcome.executorId.toLowerCase() ===
                    NEAR_CONFIG.assetBridge.toLowerCase()
                ) {
                    const validLogs: string[] = []
                    for (
                        let i = 0;
                        i < rxExOutcome.executionOutcome.outcome.logs.length;
                        i++
                    ) {
                        const log = rxExOutcome.executionOutcome.outcome.logs[i];
                        const trimmedLog = log.split("EVENT_JSON:")[1];
                        const parsedLog = JSON.parse(trimmedLog);
                        if (EVENTS_TO_TRACK.includes(parsedLog.event.toLowerCase())) {
                            logger.info(parsedLog.event.toUpperCase())
                            validLogs.push(log);
                        }
                    }
                    if (validLogs.length > 0) {
                        const response = await putNewEventLog(eventlogcollection,
                            {
                                blockHash: streamerMessage.block.header.hash,
                                height: streamerMessage.block.header.height,
                                receipt: {
                                    predecessorId: rxExOutcome.receipt.predecessorId,
                                    receiverId: rxExOutcome.receipt.receiverId,
                                    receiptId: rxExOutcome.receipt.receiptId,
                                },
                                shardId: shard.shardId,
                                events: validLogs,
                                gasBrunt: rxExOutcome.executionOutcome.outcome.gasBurnt,
                                timestamp:
                                    streamerMessage.block.header.timestamp,
                            }
                        );
                        logger.info(`Event Pushed in DB`);
                    }
                }
            }
        }
        await updateLastUpdatedBlock(
            chainStatecollection,
            streamerMessage.block.header.height
        );
        logger.info(`Updating last block:${streamerMessage.block.header.height}`);
    } catch (error) {
        logger.error(error);
        logger.error(`${NEAR_CONFIG.networkId} error in Block # Shards: ${error}`);
        //     await sendSlackMessage(
        //         `handleStreamerMessage error - ${JSON.stringify(error)}`
        //     );
    }
}

export const startStreamService = async (db: Db) => {
    try {
        const eventlogcollection = await createCollection(db, "eventlogs");
        const chainStatecollection = await createCollection(db, "chainstates");
        const lastSyncedBlock = await getLastSyncedBlock(chainStatecollection);
        const startBlock = lastSyncedBlock
            ? lastSyncedBlock + 1
            : lakeConfig.startBlockHeight;
        const latestLakeConfig = { ...lakeConfig, startBlockHeight: startBlock };
        logger.info(`Starting stream from block ${startBlock}`);
        await startStream(latestLakeConfig, (streamerMessage: types.StreamerMessage) => handleStreamerMessage(streamerMessage, eventlogcollection, chainStatecollection));
    } catch (e) {
        logger.error(`${NEAR_CONFIG.networkId} error - ${e}`);
        // await sendSlackMessage(`startStreamService stopped - ${JSON.stringify(e)}`);
    }
};

// if (ENABLE_NEAR_REST_SYNC) {
//     setTimeout(() => startStreamService(), 5000);
// }