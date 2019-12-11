import { Document } from 'mongoose';
export interface Message extends Document {
    content: string,
    sender_name: string,
    timestamp_ms: Date | null,
    type: String,
    reactions: Array<any>
}