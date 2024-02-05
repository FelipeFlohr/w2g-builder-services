import { Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { DiscordMessageDTO } from "../../models/discord-message.dto";
import { DiscordMessageRepository } from "../discord-message.repository";
import { MessengerBaseTypeORMRepository } from "src/database/base/impl/messenger-base-typeorm.repository";
import { DiscordMessageTypeORMEntity } from "../../entities/impl/discord-message.typeorm.entity";
import { DatabaseService } from "src/database/database.service";
import { QueryFailedError } from "typeorm";
import { MessageIsAlreadyDelimitationError } from "../../errors/message-is-already-delimitation.error";
import { TypeUtils } from "src/utils/type-utils";
import { DiscordService } from "../../services/discord.service";

@Injectable()
export class DiscordMessageRepositoryImpl
  extends MessengerBaseTypeORMRepository<DiscordMessageTypeORMEntity>
  implements DiscordMessageRepository
{
  private readonly service: DiscordService;

  public constructor(
    @Inject(DatabaseService) databaseService: DatabaseService,
    @Inject(forwardRef(() => DiscordService)) service: DiscordService,
  ) {
    super(databaseService, DiscordMessageTypeORMEntity);
    this.service = service;
  }

  public async saveMessage(message: DiscordMessageDTO, forceCreation = false): Promise<number> {
    if (!forceCreation) {
      const messageId = await this.findMessageIdOnDatabaseByMessageId(message);
      if (messageId) {
        await this.updateMessageById(messageId, message);
        return messageId;
      }
    }
    return await this.saveNewMessage(message);
  }

  public async updateMessageById(messageId: number, message: DiscordMessageDTO): Promise<void> {
    await this.service.updateMessageAuthorById(messageId, message.author);
    await this.getRepository()
      .createQueryBuilder()
      .update(DiscordMessageTypeORMEntity)
      .set({
        applicationId: message.applicationId,
        channelId: message.channelId,
        cleanContent: message.cleanContent,
        content: message.content,
        deleted: false,
        guildId: message.guildId,
        hasThread: message.hasThread,
        messageId: message.id,
        pinnable: message.pinnable,
        pinned: message.pinned,
        position: message.position,
        system: message.system,
        updatedAt: new Date(),
        url: message.url,
        version: () => "version + 1",
      })
      .where("id = :id", { id: messageId })
      .execute();
  }

  public async updateMessage(message: DiscordMessageDTO): Promise<void> {
    const messageId = await this.findMessageIdOnDatabaseByMessageId(message);
    if (messageId) {
      return await this.updateMessageById(messageId, message);
    }
  }

  public async softDeleteMessage(message: DiscordMessageDTO): Promise<void> {
    await this.getRepository()
      .createQueryBuilder()
      .update()
      .set({
        deleted: true,
      })
      .where("messageId = :messageId", { messageId: message.id })
      .execute();
  }

  private async findMessageIdOnDatabaseByMessageId(message: DiscordMessageDTO): Promise<number | undefined> {
    const res = await this.getRepository().findOne({
      select: {
        id: true,
      },
      where: {
        messageId: message.id,
      },
    });
    return TypeUtils.parseNullToUndefined(res?.id);
  }

  private async saveNewMessage(message: DiscordMessageDTO): Promise<number> {
    try {
      const builder = this.getRepository()
        .createQueryBuilder()
        .insert()
        .into(DiscordMessageTypeORMEntity)
        .values({
          applicationId: message.applicationId,
          authorId: await this.service.saveAuthor(message.author),
          channelId: message.channelId,
          cleanContent: message.cleanContent,
          content: message.content,
          guildId: message.guildId,
          hasThread: message.hasThread,
          messageCreatedAt: message.createdAt,
          messageId: message.id,
          pinnable: message.pinnable,
          pinned: message.pinned,
          position: message.position,
          system: message.system,
          url: message.url,
        })
        .returning(`"DME_ID"`);

      return (await builder.execute()).raw;
    } catch (e) {
      if (e instanceof QueryFailedError && e.message.toLowerCase().includes("duplicate key")) {
        throw new MessageIsAlreadyDelimitationError();
      }
      throw e;
    }
  }

  private async findAuthorIdByMessageId(messageId: number): Promise<number> {
    const res = await this.getRepository().findOne({
      select: {
        authorId: true,
      },
      where: {
        id: messageId,
      },
    });

    if (res) {
      return res.authorId;
    }
    throw new NotFoundException();
  }
}
