import { Inject } from "@nestjs/common";
import { DiscordMessageDTO } from "src/models/discord-message.dto";
import { MessengerBaseTypeORMRepository } from "src/modules/database/base/impl/messenger-base-typeorm.repository";
import { DatabaseServiceProvider } from "src/modules/database/providers/database-service.provider";
import { DatabaseService } from "src/modules/database/services/database.service";
import { CollectionUtils } from "src/utils/collection.utils";
import { TypeUtils } from "src/utils/type.utils";
import { DiscordMessageTypeORMEntity } from "../../entities/impl/discord-message.typeorm.entity";
import { DiscordMessageAuthorRepositoryProvider } from "../../providers/discord-message-author-repository.provider";
import { DiscordMessageAuthorRepository } from "../discord-message-author.repository";
import { DiscordMessageRepository } from "../discord-message.repository";

export class DiscordMessageRepositoryImpl
  extends MessengerBaseTypeORMRepository<DiscordMessageTypeORMEntity>
  implements DiscordMessageRepository
{
  private readonly authorRepository: DiscordMessageAuthorRepository;

  public constructor(
    @Inject(DatabaseServiceProvider) databaseService: DatabaseService,
    @Inject(DiscordMessageAuthorRepositoryProvider) authorRepository: DiscordMessageAuthorRepository,
  ) {
    super(databaseService, DiscordMessageTypeORMEntity);
    this.authorRepository = authorRepository;
  }

  public async getById(id: number): Promise<DiscordMessageTypeORMEntity | undefined> {
    const res = await this.getRepository().findOneBy({ id });
    return TypeUtils.parseNullToUndefined(res);
  }

  public async deleteById(id: number): Promise<number | undefined> {
    if (await this.existsById(id)) {
      const authorId = await this.getAuthorIdByMessageId(id);
      await this.authorRepository.deleteById(authorId);
      await this.getRepository().delete(id);
      return id;
    }
  }

  public async existsById(id: number): Promise<boolean> {
    return await this.getRepository().existsBy({ id });
  }

  public async deleteManyByChannelIdAndGuildId(channelId: string, guildId: string): Promise<number> {
    let res = 0;
    const ids = await this.getManyIdsByChannelIdAndGuildId(channelId, guildId);
    await CollectionUtils.asyncForEach(ids, async (id) => {
      await this.deleteById(id);
      res++;
    });

    return res;
  }

  public async upsert(message: DiscordMessageDTO): Promise<DiscordMessageTypeORMEntity> {
    const persistedMessage = await this.getRepository().findOne({
      select: { id: true, author: { id: true } },
      relations: { author: true },
      where: { messageId: message.id },
      loadEagerRelations: false,
    });

    const entity = DiscordMessageTypeORMEntity.fromDTO(message);
    if (persistedMessage?.id) {
      entity.id = persistedMessage.id;
      entity.authorId = persistedMessage.author.id;
      entity.author.id = persistedMessage.author.id;
    }
    const res = await this.getRepository().save(entity, { reload: true });
    return res;
  }

  public async deleteByMessageIdAndChannelIdAndGuildId(
    messageId: string,
    channelId: string,
    guildId: string,
  ): Promise<boolean> {
    const message = await this.getRepository().findOne({
      select: { id: true },
      where: { messageId, channelId, guildId },
      loadEagerRelations: false,
    });
    if (message?.id) {
      const res = await this.deleteById(message.id);
      return res != undefined;
    }
    return false;
  }

  public async upsertMany(messages: DiscordMessageDTO[]): Promise<void> {
    await CollectionUtils.asyncForEach(messages, async (message) => {
      await this.upsert(message);
    });
  }

  public async existsByMessageIdAndChannelIdAndGuildId(
    messageId: string,
    channelId: string,
    guildId: string,
  ): Promise<boolean> {
    return await this.getRepository().existsBy({ messageId, channelId, guildId });
  }

  public async getUrlById(id: number): Promise<string | undefined> {
    const res = await this.getRepository().findOne({
      select: { url: true },
      loadEagerRelations: false,
      loadRelationIds: false,
      where: { id },
    });
    return res?.url;
  }

  private async getAuthorIdByMessageId(id: number): Promise<number> {
    const res = await this.getRepository().findOne({
      select: { authorId: true },
      where: { id },
      loadEagerRelations: false,
    });
    return res?.authorId as number;
  }

  private async getManyIdsByChannelIdAndGuildId(channelId: string, guildId: string): Promise<Array<number>> {
    const res = await this.getRepository().find({
      select: { id: true },
      where: { channelId, guildId },
      loadEagerRelations: false,
    });
    return res.map((e) => e.id);
  }
}
