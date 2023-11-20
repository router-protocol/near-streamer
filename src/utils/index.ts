import { CHAIN_ID, LCD } from "../constant";
import logger from "../logger";

export const getEventId = (blocklog: any) => {
    return blocklog.height.toString() + blocklog.shardId.toString() + blocklog.receipt.receiptId.toString();
}


export const fetchContractsToTrack = async (): Promise<string[]> => {
    logger.info("Fetching contracts to track")
    if (LCD === "") {
        throw new Error("LCD is not set")
    }
    return fetch(LCD).then((res) => {
        return res.json();
    }).then((res) => {
        const contractConfig = res["contractConfig"];
        return contractConfig.filter((contract: any) => {
            return contract["chainId"] === CHAIN_ID && contract["contract_enabled"] === true;
        }).map((contract: any) => {
            return contract["contractAddress"];
        })
    }).catch((err) => {
        throw (err)
    });
}