import { AMQPService } from "src/amqp/services/amqp.service";
import { DiscordMessageDTO } from "../../models/discord-message.dto";
import { DiscordAMQPService } from "../discord-amqp.service";
import { AMQPQueue } from "src/amqp/business/amqp-queue";
import { AMQPExchange } from "src/amqp/business/amqp-exchange";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { AMQPExchangeTypeEnum } from "src/amqp/types/amqp-exchange-type.enum";

@Injectable()
export class DiscordAMQPServiceImpl
  implements DiscordAMQPService, OnModuleInit
{
  private readonly amqpService: AMQPService;
  private messagesCreatedQueue: AMQPQueue;
  private messagesDeletedQueue: AMQPQueue;
  private messagesExchange: AMQPExchange;

  private static readonly MESSAGES_CREATED_QUEUE_NAME = "messages.created";
  private static readonly MESSAGES_DELETED_QUEUE_NAME = "messages.deleted";
  private static readonly MESSAGES_EXCHANGE_NAME = "messages.ex";

  public constructor(@Inject(AMQPService) amqpService: AMQPService) {
    this.amqpService = amqpService;
  }

  public async onModuleInit() {
    await this.setupAmqp();
  }

  public async sendCreatedMessage(message: DiscordMessageDTO): Promise<void> {
    await this.amqpService.channel.sendMessage(
      this.messagesExchange,
      DiscordAMQPServiceImpl.MESSAGES_CREATED_QUEUE_NAME,
      message,
    );
  }

  public async sendDeletedMessage(message: DiscordMessageDTO): Promise<void> {
    await this.amqpService.channel.sendMessage(
      this.messagesExchange,
      DiscordAMQPServiceImpl.MESSAGES_DELETED_QUEUE_NAME,
      message,
    );
  }

  private async setupAmqp(): Promise<void> {
    this.messagesCreatedQueue = await this.amqpService.channel.assertQueue({
      name: DiscordAMQPServiceImpl.MESSAGES_CREATED_QUEUE_NAME,
    });
    this.messagesDeletedQueue = await this.amqpService.channel.assertQueue({
      name: DiscordAMQPServiceImpl.MESSAGES_DELETED_QUEUE_NAME,
    });
    this.messagesExchange = await this.amqpService.channel.assertExchange({
      name: DiscordAMQPServiceImpl.MESSAGES_EXCHANGE_NAME,
      type: AMQPExchangeTypeEnum.TOPIC,
    });

    await this.amqpService.channel.bindQueueToExchange({
      queue: this.messagesCreatedQueue,
      exchange: this.messagesExchange,
    });
    await this.amqpService.channel.bindQueueToExchange({
      queue: this.messagesDeletedQueue,
      exchange: this.messagesExchange,
    });
  }
}
