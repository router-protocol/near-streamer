import * as path from 'path';

require("dotenv").config({ path: path.resolve(__dirname, '../../.env') });

export const NEAR_TESTNET_CONFIG = {
    networkId: "near-testnet",
    nodeUrl: "https://rpc.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
    assetForwarder: "asset_forwarder_testnet.router_protocol.testnet",
    assetBridge: "gateway-1692892905501.router_protocol.testnet",
    s3BucketName: "near-lake-data-testnet",
    s3RegionName: "eu-central-1",
    startBlockHeight: 144084600,
    blocksPreloadPoolSize: 1,
    nearExplorerApi: "https://api-testnet.nearblocks.io",
};

export const MONGO_DB_URI = process.env.MONGO_DB_URI ?? "mongodb://127.0.0.1:27017/";
