import { Inject, Injectable } from "@nestjs/common";
import { DiscordDelimitationMessageDTO } from "src/models/discord-demilitation-message.dto";
import { MessengerBaseTypeORMRepository } from "src/modules/database/base/impl/messenger-base-typeorm.repository";
import { DatabaseServiceProvider } from "src/modules/database/providers/database-service.provider";
import { DatabaseService } from "src/modules/database/services/database.service";
import { TypeUtils } from "src/utils/type.utils";
import { DiscordDelimitationMessageEntity } from "../../entities/discord-delimitation-message.entity";
import { DiscordDelimitationMessageTypeORMEntity } from "../../entities/impl/discord-delimitation-message.typeorm.entity.impl";
import { DiscordMessageRepositoryProvider } from "../../providers/discord-message-repository.provider";
import { DiscordDelimitationMessageRepository } from "../discord-delimitation-message.repository";
import { DiscordMessageRepository } from "../discord-message.repository";

@Injectable()
export class DiscordDelimitationMessageRepositoryImpl
  extends MessengerBaseTypeORMRepository<DiscordDelimitationMessageTypeORMEntity>
  implements DiscordDelimitationMessageRepository
{
  private readonly messageRepository: DiscordMessageRepository;

  public constructor(
    @Inject(DatabaseServiceProvider) databaseService: DatabaseService,
    @Inject(DiscordMessageRepositoryProvider) messageRepository: DiscordMessageRepository,
  ) {
    super(databaseService, DiscordDelimitationMessageTypeORMEntity);
    this.messageRepository = messageRepository;
  }

  public async getById(id: number): Promise<DiscordDelimitationMessageTypeORMEntity | undefined> {
    const res = await this.getRepository().findOneBy({ id });
    return TypeUtils.parseNullToUndefined(res);
  }

  public async deleteById(id: number): Promise<number | undefined> {
    if (await this.existsById(id)) {
      const delimitation = (await this.getChannelIdAndGuildIdByDelimitationMessageId(
        id,
      )) as DiscordDelimitationMessageTypeORMEntity;
      await this.messageRepository.deleteManyByChannelIdAndGuildId(
        delimitation.message.channelId,
        delimitation.message.guildId,
      );
      await this.getRepository().delete(id);
      return id;
    }
  }

  public async existsById(id: number): Promise<boolean> {
    return await this.getRepository().existsBy({ id });
  }

  public async getByChannelIdAndGuildId(
    channelId: string,
    guildId: string,
  ): Promise<DiscordDelimitationMessageEntity | undefined> {
    const res = await this.getRepository().findOneBy({
      message: {
        channelId,
        guildId,
      },
    });
    return TypeUtils.parseNullToUndefined(res);
  }

  public async deleteByGuildIdAndChannelId(channelId: string, guildId: string): Promise<boolean> {
    const message = await this.getRepository().findOne({
      select: { id: true },
      where: { message: { channelId, guildId } },
      relations: { message: true },
      loadEagerRelations: false,
    });

    if (message) {
      await this.deleteById(message.id);
    }
    return false;
  }

  public async save(delimitation: DiscordDelimitationMessageDTO): Promise<DiscordDelimitationMessageEntity> {
    const message = await this.messageRepository.upsert(delimitation.message);
    const entity = DiscordDelimitationMessageTypeORMEntity.fromDTO(delimitation);
    entity.message = message;

    const delimitationIdOnThisChannel = await this.getDelimitationIdByChannelIdAndGuildId(
      delimitation.message.channelId,
      delimitation.message.guildId,
    );
    if (delimitationIdOnThisChannel) {
      await this.deleteById(delimitationIdOnThisChannel);
    }
    return await this.getRepository().save(entity, { reload: true });
  }

  public async existsByMessageIdAndChannelIdAndGuildId(
    messageId: string,
    channelId: string,
    guildId: string,
  ): Promise<boolean> {
    return await this.getRepository().existsBy({
      message: {
        messageId,
        channelId,
        guildId,
      },
    });
  }

  public async getMessageUrlByChannelIdAndGuildId(channelId: string, guildId: string): Promise<string | undefined> {
    const delimitation = await this.getRepository().findOne({
      select: { messageId: true },
      relations: { message: true },
      loadEagerRelations: false,
      relationLoadStrategy: "join",
      where: { message: { channelId, guildId } },
    });
    if (delimitation?.messageId) {
      return await this.messageRepository.getUrlById(delimitation.messageId);
    }
  }

  private async getChannelIdAndGuildIdByDelimitationMessageId(
    id: number,
  ): Promise<DiscordDelimitationMessageTypeORMEntity | undefined> {
    const res = await this.getRepository().findOne({
      select: { message: { channelId: true, messageId: true } },
      where: { id },
      relations: { message: true },
      loadEagerRelations: false,
    });
    return TypeUtils.parseNullToUndefined(res);
  }

  private async getDelimitationIdByChannelIdAndGuildId(
    channelId: string,
    guildId: string,
  ): Promise<number | undefined> {
    const res = await this.getRepository().findOne({
      select: { id: true },
      where: { message: { channelId, guildId } },
      relations: { message: true },
      loadEagerRelations: false,
    });
    return TypeUtils.parseNullToUndefined(res?.id);
  }
}
