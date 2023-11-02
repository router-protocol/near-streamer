import mongoose from "mongoose";

export const CHAIN_STATE = "CHAIN_STATE";

const chainStateSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    lastSyncedBlock: {
        type: Number,
        default: 0,
    },
});

export const ChainState = mongoose.model(
    "ChainState",
    chainStateSchema
);