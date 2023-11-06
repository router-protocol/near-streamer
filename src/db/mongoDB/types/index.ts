import { Document } from "mongodb";

export interface IBlocklog {
    height: number;
    timestamp: number;
    gasBrunt: number;
    blockHash: string;
    shardId: number;
    receipt: {
        predecessorId: string;
        receiverId: string;
        receiptId: string;
    }
    events: string[];
}
