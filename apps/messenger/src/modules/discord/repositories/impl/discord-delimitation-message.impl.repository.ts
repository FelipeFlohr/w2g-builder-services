import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DiscordMessageDTO } from "../../models/discord-message.dto";
import { DiscordDelimitationMessageRepository } from "../discord-delimitation-message.repository";
import { DatabaseService } from "src/database/database.service";
import { MessengerBaseTypeORMRepository } from "src/database/base/impl/messenger-base-typeorm.repository";
import { DiscordDelimitationMessageTypeORMEntity } from "../../entities/impl/discord-delimitation-message.typeorm.entity";
import { DiscordDelimitationMessageWithListenerDTO } from "../../models/discord-delimitation-message-with-listener.dto";
import { DiscordService } from "../../services/discord.service";
import { DiscordDelimitationMessageWithListenerOptions } from "../../types/discord-delimitation-message-with-listener-options.type";
import { DiscordMessageTypeORMEntity } from "../../entities/impl/discord-message.typeorm.entity";
import { DiscordDelimitationMessageEntity } from "../../entities/discord-delimitation-message.entity";
import { DiscordPersistedDelimitationMessageDTO } from "../../models/discord-persisted-delimitation-message.dto";

@Injectable()
export class DiscordDelimitationMessageRepositoryImpl
  extends MessengerBaseTypeORMRepository<DiscordDelimitationMessageTypeORMEntity>
  implements DiscordDelimitationMessageRepository
{
  private readonly service: DiscordService;

  public constructor(
    @Inject(DatabaseService) databaseService: DatabaseService,
    @Inject(forwardRef(() => DiscordService)) service: DiscordService,
  ) {
    super(databaseService, DiscordDelimitationMessageTypeORMEntity);
    this.service = service;
  }

  public async saveDelimitation(message: DiscordMessageDTO): Promise<DiscordPersistedDelimitationMessageDTO> {
    if (await this.delimitationMessageExistsByGuildAndChannelId(message.guildId, message.channelId)) {
      await this.deleteDelimitationByGuildAndChannelId(message.guildId, message.channelId);
    }

    const messageId = await this.service.saveMessage(message);
    const res = await this.getRepository().save({
      messageId: messageId,
    });
    await this.service.cacheChannelMessages(message.guildId, message.channelId, false);

    return new DiscordPersistedDelimitationMessageDTO(res.id, res.createdAt, message);
  }

  public async getDelimitationMessagesWithListener(): Promise<DiscordDelimitationMessageWithListenerDTO[]> {
    const res = (await this.getRepository()
      .createQueryBuilder("ddm")
      .select("ddm.messageId", "messageId")
      .addSelect("ddm.createdAt", "delimitationCreatedAt")
      .addSelect("ddm.id", "delimitationId")
      .addSelect("dme.channelId", "channelId")
      .addSelect("dme.guildId", "guildId")
      .addSelect("dme.messageId", "discordMessageId")
      .innerJoin("ddm.message", "dme")
      .getRawMany()) as Array<DiscordDelimitationMessageWithListenerOptions>;

    return res.map((entity) => new DiscordDelimitationMessageWithListenerDTO(entity));
  }

  public async delimitationMessageExistsByGuildAndChannelId(guildId: string, channelId: string): Promise<boolean> {
    return await this.getRepository().existsBy({
      message: {
        guildId: guildId,
        channelId: channelId,
      },
    });
  }

  public async deleteDelimitationByGuildAndChannelId(guildId: string, channelId: string): Promise<void> {
    const msgSubquery = this.getRepository(DiscordMessageTypeORMEntity)
      .createQueryBuilder("dme")
      .select("dme.id")
      .where("dme.guildId = :guildId and dme.channelId = :channelId", { guildId, channelId });

    const query = this.getRepository()
      .createQueryBuilder()
      .delete()
      .from(DiscordDelimitationMessageTypeORMEntity, "ddm")
      .where(`messageId in (${msgSubquery.getQuery()})`, { guildId, channelId })
      .setParameters(msgSubquery.getParameters());

    await query.execute();
  }

  public async getDelimitationMessageLinkByGuildAndChannelId(
    guildId: string,
    channelId: string,
  ): Promise<string | undefined> {
    const res = await this.getRepository()
      .createQueryBuilder()
      .select("dme.url", "url")
      .from(DiscordDelimitationMessageTypeORMEntity, "ddm")
      .innerJoin("ddm.message", "dme")
      .where("dme.guildId = :guildId and dme.channelId = :channelId", { guildId, channelId })
      .getRawOne<Record<string, string>>();

    return res?.url;
  }

  public async getDelimitationMessageByGuildAndChannelId(
    guildId: string,
    channelId: string,
  ): Promise<DiscordDelimitationMessageEntity> {
    return (await this.getRepository().findOne({
      relations: {
        message: {
          author: true,
        },
      },
      where: {
        message: {
          guildId: guildId,
          channelId: channelId,
        },
      },
    })) as DiscordDelimitationMessageEntity;
  }
}
