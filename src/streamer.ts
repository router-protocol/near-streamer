import { startStream, types } from "near-lake-framework";
import { FORCE_START_BLOCK, LOOK_BACK_BLOCKS, NEAR_CONFIG } from "./constant";
import logger from "./logger";
import { getLastSyncedBlock, updateLastUpdatedBlock } from "./db/mongoDB/action/chainState";
import { getCollection } from "./db/mongoDB/";
import { putNewBlocklog } from "./db/mongoDB/action/blockLog";
import { fetchContractsToTrack } from "./utils";
const nearAPI = require("near-api-js");
const { connect } = nearAPI;

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

export let CONTRACTS_TO_TRACK: string[]

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
// const blocklogActions = new BlocklogActions();

export async function handleStreamerMessage(
    streamerMessage: types.StreamerMessage
): Promise<void> {
    const collections = await Promise.all(CONTRACTS_TO_TRACK.map((key) => {
        return getCollection("blocklogs_" + key);
    }
    ));

    const contractAndCollection = CONTRACTS_TO_TRACK.reduce((accumulator, key, index) => {
        accumulator[key] = collections[index];
        return accumulator;
    }, {});;
    const chainStatecollection = await getCollection("chainstates");

    logger.info(
        `${NEAR_CONFIG.networkId} Block # Shards: ${JSON.stringify(
            streamerMessage.block.header.height
        )}`
    );
    try {
        const validLogs = new Map<string, number>(
            CONTRACTS_TO_TRACK.map((contract) => [contract, 0])
        );
        for (let k = 0; k < streamerMessage.shards.length; k++) {
            const shard = streamerMessage.shards[k];
            for (let j = 0; j < shard.receiptExecutionOutcomes.length; j++) {

                const rxExOutcome = shard.receiptExecutionOutcomes[j];
                if (
                    CONTRACTS_TO_TRACK.includes(rxExOutcome.receipt.receiverId.toLowerCase())
                ) {
                    for (
                        let i = 0;
                        i < rxExOutcome.executionOutcome.outcome.logs.length;
                        i++
                    ) {
                        const log = rxExOutcome.executionOutcome.outcome.logs[i];
                        if (!log.includes("EVENT_JSON:")) {
                            continue
                        }
                        const trimmedLog = log.split("EVENT_JSON:")[1];
                        const parsedLog = JSON.parse(trimmedLog);
                        if (EVENTS_TO_TRACK.includes(parsedLog.event.toLowerCase())) {
                            logger.info(parsedLog.event.toUpperCase(), streamerMessage.block.header.height)
                            validLogs.set(
                                rxExOutcome.receipt.receiverId.toLowerCase(),
                                validLogs.get(rxExOutcome.receipt.receiverId.toLowerCase())! + 1
                            );
                        }
                    }

                }
            }
        }
        for (let [key, value] of validLogs) {
            if (value > 0) {
                const response = await putNewBlocklog(contractAndCollection[key],
                    {
                        height: streamerMessage.block.header.height,
                        blockDump: streamerMessage
                    }
                );
                logger.info(`Block Pushed in DB`);
            }
        }
        await updateLastUpdatedBlock(
            chainStatecollection,
            streamerMessage.block.header.height
        );
        logger.info(`Updating last block:${streamerMessage.block.header.height}`);
    } catch (error) {
        logger.error(error);
        logger.error(`${NEAR_CONFIG.networkId} error in Block # Shards: ${streamerMessage.block.header.height}`);
        //     await sendSlackMessage(
        //         `handleStreamerMessage error - ${JSON.stringify(error)}`
        //     );
    }
}

export const startStreamService = async () => {
    try {
        const contractsToTrack = await fetchContractsToTrack();
        CONTRACTS_TO_TRACK = [...contractsToTrack]
        if (CONTRACTS_TO_TRACK.length === 0) {
            logger.error("No contracts to track")
            return;
        } else {
            logger.info(`Tracking ${CONTRACTS_TO_TRACK.length} contracts`)
        }
        const chainStatecollection = await getCollection("chainstates");
        const lastSyncedBlock = await getLastSyncedBlock(chainStatecollection);
        // let initialStartBlock = lastSyncedBlock
        // const startBlock = lastSyncedBlock
        //     ? lastSyncedBlock - LOOK_BACK_BLOCKS
        //     : lakeConfig.startBlockHeight;
        let startBlock = lakeConfig.startBlockHeight
        if (lastSyncedBlock) {
            startBlock = lastSyncedBlock - LOOK_BACK_BLOCKS
        } else if (startBlock < 0) {
            const nearConnection = await connect(NEAR_CONFIG);
            const latestBlockHeight: number = await nearConnection.connection.provider.status().then((status) => {
                return status.sync_info.latest_block_height;
            });
            startBlock = latestBlockHeight
        }
        const latestLakeConfig = { ...lakeConfig, startBlockHeight: FORCE_START_BLOCK ? parseInt(FORCE_START_BLOCK) : startBlock };
        logger.info(`Starting stream from block ${startBlock}`);
        await startStream(latestLakeConfig, handleStreamerMessage);
    } catch (e) {
        logger.error(`${NEAR_CONFIG.networkId} error - ${e}`);
        // await sendSlackMessage(`startStreamService stopped - ${JSON.stringify(e)}`);
    }
};

// if (ENABLE_NEAR_REST_SYNC) {
//     setTimeout(() => startStreamService(), 5000);
// }
// "timestamp":1699429241208249000,"timestampNanosec":"1699429241208248995"