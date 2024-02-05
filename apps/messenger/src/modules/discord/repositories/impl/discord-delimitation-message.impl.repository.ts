import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DiscordMessageDTO } from "../../models/discord-message.dto";
import { DiscordDelimitationMessageRepository } from "../discord-delimitation-message.repository";
import { DatabaseService } from "src/database/database.service";
import { MessengerBaseTypeORMRepository } from "src/database/base/impl/messenger-base-typeorm.repository";
import { DiscordDelimitationMessageTypeORMEntity } from "../../entities/impl/discord-delimitation-message.typeorm.entity";
import { DiscordDelimitationMessageWithListenerDTO } from "../../models/discord-delimitation-message-with-listener.dto";
import { FindOptionsWhere } from "typeorm";
import { DiscordService } from "../../services/discord.service";
import { DiscordDelimitationMessageWithListenerOptions } from "../../types/discord-delimitation-message-with-listener-options.type";

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

  public async saveDelimitation(message: DiscordMessageDTO): Promise<number> {
    if (await this.delimitationMessageExistsByGuildAndChannelId(message.guildId, message.channelId)) {
      await this.deleteDelimitationByGuildAndChannelId(message.guildId, message.channelId);
    }

    const messageId = await this.service.saveMessage(message);
    const res = await this.getRepository().save({
      messageId: messageId,
    });
    return res.id;
  }

  public async getDelimitationMessagesWithListener(): Promise<DiscordDelimitationMessageWithListenerDTO[]> {
    const res = (await this.getRepository()
      .createQueryBuilder("ddm")
      .select("ddm.messageId", "messageId")
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
    const criteria: FindOptionsWhere<DiscordDelimitationMessageTypeORMEntity> = {
      message: {
        channelId: channelId,
        guildId: guildId,
      },
    };
    await this.getRepository().delete(criteria);
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
}
