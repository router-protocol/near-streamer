import { IBlocklog } from "../db/mongoDB/types";

export const getEventId = (blocklog: IBlocklog) => {
    return blocklog.height.toString() + blocklog.shardId.toString() + blocklog.receipt.receiptId.toString();
}