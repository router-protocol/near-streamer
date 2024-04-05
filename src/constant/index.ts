import e from 'cors';
import * as path from 'path';

require("dotenv").config({ path: path.resolve(__dirname, '../../.env') });

export const NETWORK = process.env.NETWORK ?? "testnet";

console.log(`NETWORK: ${NETWORK}`);

export const NEAR_TESTNET_CONFIG = {
    networkId: "near-testnet",
    nodeUrl: "https://rpc.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
    assetForwarder: "asset_forwarder_testnet.router_protocol.testnet",
    assetBridge: "gateway-1692892905501.router_protocol.testnet",
    gateway: "gateway-1692892905501.router_protocol.testnet",
    s3BucketName: "near-lake-data-testnet",
    s3RegionName: "eu-central-1",
    startBlockHeight: parseInt(process.env.START_BLOCK) ?? 144084600,
    blocksPreloadPoolSize: 1,
    nearExplorerApi: "https://api-testnet.nearblocks.io",
};

export const NEAR_MAINNET_CONFIG = {
    networkId: "near",
    nodeUrl: "https://rpc.mainnet.near.org",
    explorerUrl: "https://explorer.near.org",
    assetForwarder: "assetforwarder-routerprotocol.near",
    assetBridge: "assetforwarder-routerprotocol.near",
    gateway: "gateway-routerprotocol.near",
    s3BucketName: "near-lake-data-testnet",
    s3RegionName: "eu-central-1",
    startBlockHeight: parseInt(process.env.START_BLOCK) ?? 144084600,
    blocksPreloadPoolSize: 1,
    nearExplorerApi: "https://api.nearblocks.io",
};

export const NEAR_CONFIG = NETWORK === "mainnet" ? NEAR_MAINNET_CONFIG : NEAR_TESTNET_CONFIG;

const LCDs: { [key: string]: string } = {
    "mainnet": "https://sentry.lcd.routerprotocol.com/router-protocol/router-chain/multichain/contract_config",
    "testnet": "https://lcd.testnet.routerchain.dev/router-protocol/router-chain/multichain/contract_config",
    "devnet-alpha": "https://devnet-alpha.lcd.routerprotocol.com/router-protocol/router-chain/multichain/contract_config",
}

export const MONGO_DB_URI = process.env.MONGO_DB_URI ?? "mongodb://127.0.0.1:27017/";
export const CHAIN_ID = NETWORK === "mainnet" ? "near" : "near-testnet";
export const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
export const LCD = LCDs[NETWORK] ?? "";
export const PRUNE_AFTER = parseInt(process.env.PRUNE_AFTER ?? "604800");
export const LOOK_BACK_BLOCKS = 100
export const ALERTER_ACTIVE = process.env.ALERTER_ACTIVE === "true" ?? false;