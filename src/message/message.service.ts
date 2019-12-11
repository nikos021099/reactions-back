import {Injectable, OnModuleInit} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Message} from "./message.interface";

@Injectable()
export class MessageService implements OnModuleInit{


    constructor(@InjectModel('Message') private readonly messageModel: Model<Message>) {
    }

    async findAll(): Promise<Message[]> {
        return await this.messageModel.find().exec();
    }

    async findByPerson(person: String): Promise<Message[]> {
        return await this.messageModel.find({
            "sender_name": person
        }).exec();
    }


    async findDistinctPeople(): Promise<Message[]> {
        return await this.messageModel.aggregate([
            {
                $group: {
                    _id: "$sender_name",
                },
            },
            {
                $project: {
                    _id: 0,
                    name : '$_id'
                }
            },


        ]).exec();
    }

    async findTotalMessages(person = {$exists: true}): Promise<Message[]> {
        return await this.messageModel.aggregate([
            {
                $match: {
                    sender_name: person
                }
            },
            {

                $group: {
                    _id: "$sender_name",
                    count: {
                        $sum: 1
                    }
                }
            }]).exec();
    }

    async findMostReactedMessage(): Promise<Message[]> {
        return await this.messageModel.aggregate([{
            $group: {
                _id: "$sender_name",
                count: {
                    $sum: 1
                }
            }
        }]).exec();
    }

    async findActedReactions(person = {$exists: true}): Promise<Message[]> {
        return await this.messageModel.aggregate([
            {
                $match: {
                    "reactions.actor": person
                }
            },
            {$unwind: "$reactions"},
            {
                $group: {
                    _id: "$reactions.reaction",
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    count: -1
                }
            },
            {
                $project: {
                    _id: 0,
                    reaction: "$_id",
                    count: 1
                }
            },
        ]).exec();
    }

    async findTotalReactions(person = {$exists: true}): Promise<Message[]> {
        return await this.messageModel.aggregate([
            {
                $match: {
                    sender_name: person
                }
            },
            {$unwind: "$reactions"},
            {
                $group: {
                    _id: "$reactions.reaction",
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    count: -1
                }
            },
            {$project: {_id: 0, reaction: "$_id", count: 1}},
        ]).exec();
    }

    async findLonelyReactions(person = {$exists: true}): Promise<Message[]> {
        return await this.messageModel.aggregate([
            {
                $match: {
                    sender_name: person,
                    reactions: {
                        $size: 1
                    }
                }
            },
            {$unwind: "$reactions"},
            {
                $group: {
                    _id: "$reactions.actor",
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    count: 1
                }
            },
            {$project: {_id: 0, actor: "$_id", count: 1}},
        ]).exec();
    }

    async findMessagesCount(person = {$exists: true}): Promise<Message[]> {
        return await this.messageModel.aggregate([
            {
                $match: {
                    sender_name: person
                }
            },
            {
                $project: {
                    sender_name: "$sender_name",

                    timestamp: {
                        $multiply: [
                            {
                                $floor: {
                                    $divide: [
                                        "$timestamp_ms", 24 * 3600 * 1000
                                    ]
                                }
                            }, 24 * 3600 * 1000
                        ]
                    }
                }
            },
            {

                $group: {
                    _id: "$timestamp",
                    count: {
                        $sum: 1
                    }
                }
            }]).exec();

    }

    async findMessageMatches(query): Promise<Message[]> {
        return await this.messageModel.aggregate([
            {
                $match: {
                    content: {
                        $regex: new RegExp(query, 'i')
                    }

                }
            },
            {
                $group: {
                    _id: "$sender_name",
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    count: -1
                }
            },
            {
                $project: {
                    _id: 0,
                    phrase: query,
                    sender: "$_id",
                    count: 1
                }
            },
    ]).
        exec();
    }

    async onModuleInit() {
        return;
        let messagesToSave = [];
        let letterMapping = [
            {
                og: 'ί',
                replace: 'ι'
            },
            {
                og: 'ά',
                replace: 'α'
            },
            {
                og: 'έ',
                replace: 'ε'
            },
            {
                og: 'ή',
                replace: 'η'
            },
            {
                og: 'ή',
                replace: 'η'
            },
            {

                og: 'ύ',

                replace: 'υ'
            },
            {

                og: 'ό',
                replace: 'ο'
            },
            {

                og: 'ώ',
                replace: 'ω'
            }
        ];

        for (const mapping of letterMapping) {
            let messages = await this.messageModel.aggregate([
                {
                    $match: {
                        content: {
                            $regex: new RegExp(mapping.og, 'i')
                        }
                    }
                }
            ]);
            for(const message of messages) {

                console.log(message);
                message.content = message.content.replace(new RegExp(mapping.og, 'g'), mapping.replace);
                message.id = message._id;
                delete message._id;
                console.log(message);
                messagesToSave.push(await (new this.messageModel(message)).save());
                console.log(message.content+ " SAVED");
            }
        }


        return Promise.all(messagesToSave);

    }



}

