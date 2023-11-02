import { IEventLog } from "../db/mongoDB/mongodb/types";

export const getEventId = (eventLog: IEventLog) => {
    return eventLog.height.toString() + eventLog.shardId.toString() + eventLog.receipt.receiptId.toString();
}