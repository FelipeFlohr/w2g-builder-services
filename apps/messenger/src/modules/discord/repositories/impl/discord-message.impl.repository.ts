import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DiscordMessageDTO } from "../../models/discord-message.dto";
import { DiscordMessageRepository } from "../discord-message.repository";
import { MessengerBaseTypeORMRepository } from "src/database/base/impl/messenger-base-typeorm.repository";
import { DiscordMessageTypeORMEntity } from "../../entities/impl/discord-message.typeorm.entity";
import { DatabaseService } from "src/database/database.service";
import { QueryFailedError } from "typeorm";
import { MessageIsAlreadyDelimitationError } from "../../errors/message-is-already-delimitation.error";
import { TypeUtils } from "src/utils/type-utils";
import { DiscordService } from "../../services/discord.service";
import { DiscordPersistedMessageStatusEnum } from "../../types/discord-persisted-message-status.enum";
import { DiscordMessageWithContentDTO } from "../../models/discord-message-with-content.dto";

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

  public async upsertMessage(message: DiscordMessageDTO): Promise<DiscordPersistedMessageStatusEnum> {
    const msgWithContent = await this.findMessageWithContentOnDatabaseByMessageId(message);
    if (msgWithContent) {
      if (message.content === msgWithContent.content) {
        return DiscordPersistedMessageStatusEnum.MESSAGE_EXISTS_BUT_SAME_CONTENT;
      }
      await this.updateMessage(message);
      return DiscordPersistedMessageStatusEnum.MESSAGE_EXISTS_BUT_DIFFERENT_CONTENT;
    }

    await this.saveMessage(message, true);
    return DiscordPersistedMessageStatusEnum.MESSAGE_CREATED;
  }

  private async findMessageWithContentOnDatabaseByMessageId(
    message: DiscordMessageDTO,
  ): Promise<DiscordMessageWithContentDTO | undefined> {
    const res = await this.getRepository()
      .createQueryBuilder()
      .select("dme.id", "messageId")
      .addSelect("dme.messageId", "discordMessageId")
      .addSelect("dme.content", "content")
      .from(DiscordMessageTypeORMEntity, "dme")
      .where("dme.messageId = :messageId", { messageId: message.id })
      .limit(1)
      .getRawOne();
    if (res) {
      return res;
    }
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
}
