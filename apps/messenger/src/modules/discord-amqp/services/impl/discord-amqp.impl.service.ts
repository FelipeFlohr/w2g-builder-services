import { Injectable, OnModuleInit, Inject } from "@nestjs/common";
import { DiscordDelimitationMessageDTO } from "src/models/discord-demilitation-message.dto";
import { DiscordMessageDTO } from "src/models/discord-message.dto";
import { AMQPExchange } from "src/modules/amqp/business/amqp-exchange";
import { AMQPQueue } from "src/modules/amqp/business/amqp-queue";
import { AMQPExchangeTypeEnum } from "src/modules/amqp/enums/amqp-exchange-type.enum";
import { AMQPService } from "src/modules/amqp/services/amqp.service";
import { DiscordAMQPService } from "../discord-amqp.service";
import { AMQPServiceProvider } from "src/modules/amqp/providers/amqp-service.provider";

@Injectable()
export class DiscordAMQPServiceImpl implements DiscordAMQPService, OnModuleInit {
  private readonly amqpService: AMQPService;
  private messagesCreatedQueue: AMQPQueue;
  private messagesUpdatedQueue: AMQPQueue;
  private messagesDeletedQueue: AMQPQueue;
  private messagesBootstrapQueue: AMQPQueue;
  private messagesDelimitationQueue: AMQPQueue;
  private messagesExchange: AMQPExchange;

  private static readonly MESSAGES_CREATED_QUEUE_NAME = "messages.created";
  private static readonly MESSAGES_UPDATED_QUEUE_NAME = "messages.updated";
  private static readonly MESSAGES_DELETED_QUEUE_NAME = "messages.deleted";
  private static readonly MESSAGES_BOOTSTRAP_QUEUE_NAME = "messages.bootstrap";
  private static readonly MESSAGES_DELIMITATION_QUEUE_NAME = "messages.delimitation";
  private static readonly MESSAGES_EXCHANGE_NAME = "messages.ex";

  public constructor(@Inject(AMQPServiceProvider) amqpService: AMQPService) {
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

  public async sendUpdatedMessage(message: DiscordMessageDTO): Promise<void> {
    await this.amqpService.channel.sendMessage(
      this.messagesExchange,
      DiscordAMQPServiceImpl.MESSAGES_UPDATED_QUEUE_NAME,
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

  public async sendBootstrapMessage(message: DiscordMessageDTO): Promise<void> {
    await this.amqpService.channel.sendMessage(
      this.messagesExchange,
      DiscordAMQPServiceImpl.MESSAGES_BOOTSTRAP_QUEUE_NAME,
      message,
    );
  }

  public async sendDelimitationMessage(message: DiscordDelimitationMessageDTO): Promise<void> {
    await this.amqpService.channel.sendMessage(
      this.messagesExchange,
      DiscordAMQPServiceImpl.MESSAGES_DELIMITATION_QUEUE_NAME,
      message,
    );
  }

  private async setupAmqp(): Promise<void> {
    this.messagesCreatedQueue = await this.amqpService.channel.assertQueue({
      name: DiscordAMQPServiceImpl.MESSAGES_CREATED_QUEUE_NAME,
    });
    this.messagesUpdatedQueue = await this.amqpService.channel.assertQueue({
      name: DiscordAMQPServiceImpl.MESSAGES_UPDATED_QUEUE_NAME,
    });
    this.messagesDeletedQueue = await this.amqpService.channel.assertQueue({
      name: DiscordAMQPServiceImpl.MESSAGES_DELETED_QUEUE_NAME,
    });
    this.messagesBootstrapQueue = await this.amqpService.channel.assertQueue({
      name: DiscordAMQPServiceImpl.MESSAGES_BOOTSTRAP_QUEUE_NAME,
    });
    this.messagesDelimitationQueue = await this.amqpService.channel.assertQueue({
      name: DiscordAMQPServiceImpl.MESSAGES_DELIMITATION_QUEUE_NAME,
    });
    this.messagesExchange = await this.amqpService.channel.assertExchange({
      name: DiscordAMQPServiceImpl.MESSAGES_EXCHANGE_NAME,
      type: AMQPExchangeTypeEnum.TOPIC,
    });

    await Promise.all([
      this.amqpService.channel.bindQueueToExchange({
        queue: this.messagesCreatedQueue,
        exchange: this.messagesExchange,
      }),
      this.amqpService.channel.bindQueueToExchange({
        queue: this.messagesUpdatedQueue,
        exchange: this.messagesExchange,
      }),
      this.amqpService.channel.bindQueueToExchange({
        queue: this.messagesDeletedQueue,
        exchange: this.messagesExchange,
      }),
      this.amqpService.channel.bindQueueToExchange({
        queue: this.messagesBootstrapQueue,
        exchange: this.messagesExchange,
      }),
      this.amqpService.channel.bindQueueToExchange({
        queue: this.messagesDelimitationQueue,
        exchange: this.messagesExchange,
      }),
    ]);
  }
}
