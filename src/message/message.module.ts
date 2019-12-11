import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {MessageSchema} from "./message.schema";
import {MessageService} from "./message.service";
import {MessageController} from "./message.controller";


@Module({
    imports: [MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }])],
    controllers: [MessageController],
    providers: [MessageService],
})
export class MessageModule {}