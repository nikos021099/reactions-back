import { Module } from '@nestjs/common';


import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "./config/config.module";
import {MongooseModule} from "@nestjs/mongoose";
import {MessageModule} from "./message/message.module";


@Module({
  imports: [ConfigModule, MongooseModule.forRoot('mongodb://mongodb:27017/reactions'), MessageModule],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
