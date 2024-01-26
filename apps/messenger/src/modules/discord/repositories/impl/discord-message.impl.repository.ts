import { Inject, Injectable } from "@nestjs/common";
import { DiscordMessageDTO } from "../../models/discord-message.dto";
import { DiscordMessageRepository } from "../discord-messasge.repository";
import { MessengerBaseTypeORMRepository } from "src/database/base/impl/messenger-base-typeorm.repository";
import { DiscordMessageTypeORMEntity } from "../../entities/impl/discord-message.typeorm.entity";
import { DatabaseService } from "src/database/database.service";
import { FindOptionsWhere, QueryFailedError } from "typeorm";
import { DiscordMessageAuthorTypeORMEntity } from "../../entities/impl/discord-message-author.typeorm.entity";
import { MessageIsAlreadyDelimitationError } from "../../errors/message-is-already-delimitation.error";

@Injectable()
export class DiscordMessageRepositoryImpl
  extends MessengerBaseTypeORMRepository<DiscordMessageTypeORMEntity>
  implements DiscordMessageRepository
{
  public constructor(
    @Inject(DatabaseService) databaseService: DatabaseService,
  ) {
    super(databaseService, DiscordMessageTypeORMEntity);
  }

  public async saveMessage(message: DiscordMessageDTO): Promise<number> {
    try {
      const res = await this.getRepository().save({
        applicationId: message.applicationId,
        author: new DiscordMessageAuthorTypeORMEntity({
          authorId: message.author.id,
          avatarPngUrl: message.author.avatarPngUrl,
          bannerPngUrl: message.author.bannerPngUrl,
          bot: message.author.bot,
          authorCreatedAt: message.author.createdAt,
          discriminator: message.author.discriminator,
          displayName: message.author.displayName,
          globalName: message.author.globalName,
          system: message.author.system,
          tag: message.author.tag,
          username: message.author.username,
        }),
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
      });

      return res.id;
    } catch (e) {
      if (
        e instanceof QueryFailedError &&
        e.message.toLowerCase().includes("duplicate key")
      ) {
        throw new MessageIsAlreadyDelimitationError();
      }
      throw e;
    }
  }

  public async deleteMessageByMessageId(messageId: string): Promise<void> {
    const criteria: FindOptionsWhere<DiscordMessageTypeORMEntity> = {
      messageId: messageId,
    };
    await this.getRepository().delete(criteria);
  }
}
