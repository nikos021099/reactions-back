import {Controller, Get, Param, Query} from '@nestjs/common';
import {MessageService} from "./message.service";
import {Message} from "./message.interface";
@Controller('messages')
export class MessageController {
    constructor(private readonly messageService: MessageService) {


    }

    @Get('')
    async findAll(): Promise<Message[]> {
        return await this.messageService.findAll();
    }


    @Get('total-messages')
    async findTotalMessages(): Promise<Message[]> {
        return await this.messageService.findTotalMessages();
    }
    @Get('total-messages/:person')
    async findTotalMessagesForPerson(@Param('person') person): Promise<Message[]> {
        return await this.messageService.findTotalMessages(person);
    }

    @Get('people')
    async getPeople(@Query() query): Promise<Message[]> {
        return await this.messageService.findDistinctPeople();
    }


    @Get('person')
    async findByPerson(@Query() query): Promise<Message[]> {
        return await this.messageService.findByPerson(query.person);
    }

    @Get('reaction-stats')
    async mostReactions(@Query() query): Promise<Message[]> {
        return await this.messageService.findMostReactedMessage();
    }

    @Get('reactions/actor')
    async findActedReactions(@Query() query): Promise<Message[]> {
        return await this.messageService.findActedReactions(query.sender);
    }
    @Get('reactions/sender')
    async findReactions(@Query() query): Promise<Message[]> {
        return await this.messageService.findTotalReactions(query.sender);
    }

    @Get('loneman')
    async findLoneMan(@Param('person') person): Promise<Message[]> {
        return await this.messageService.findLonelyReactions(person);
    }
    @Get('count')
    async findMessageCount(@Param('person') person): Promise<Message[]> {
        return await this.messageService.findMessagesCount(person);
    }

    @Get('phrases')
    async findPhrasesTotal(@Query() query){
        return await this.messageService.findMessageMatches(query.phrase);
    }

}
