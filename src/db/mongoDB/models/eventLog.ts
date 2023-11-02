import mongoose from "mongoose";
export const EVENT_LOGH = "event_log"
const eventLogSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    height: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Number,
        required: true,
    },
    gas_burnt: {
        type: Number,
        required: true,
    },
    blockHash: {
        type: String,
        required: true,
    },
    shardId: {
        type: Number,
        required: true,
    },
    receipt: {
        predecessor_id: String,
        receiver_id: String,
        receipt_id: String,
        // receipt: {
        //     type: Map,
        //     of: String
        // },
        // required: true,
    },
    events: {
        type: [String],
        required: true,
    }
});

export const EventLog = mongoose.model(
    "EventLog",
    eventLogSchema
);