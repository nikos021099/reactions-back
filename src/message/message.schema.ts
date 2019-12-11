import * as mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema({
    content: String,
    sender_name: String,
    timestamp_ms: { type : Date, default: Date.now },
    type: String,
    reactions: {
        type: {
            reaction: String,
            actor : String
        }
        , default: []
    },
    photos: {
        creation_timestamp: Date,
        uri: String
    }
});