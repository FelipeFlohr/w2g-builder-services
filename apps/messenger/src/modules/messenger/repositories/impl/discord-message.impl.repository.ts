import { MessengerBaseTypeORMRepository } from "src/modules/database/base/impl/messenger-base-typeorm.repository";
import { DiscordMessageTypeORMEntity } from "../../entities/impl/discord-message.typeorm.entity";
import { Inject } from "@nestjs/common";
import { DatabaseServiceProvider } from "src/modules/database/providers/database-service.provider";
import { DatabaseService } from "src/modules/database/services/database.service";
import { DiscordMessageAuthorRepository } from "../discord-message-author.repository";
import { DiscordMessageAuthorRepositoryProvider } from "../../providers/discord-message-author-repository.provider";
import { TypeUtils } from "src/utils/type.utils";
import { DiscordMessageRepository } from "../discord-message.repository";
import { CollectionUtils } from "src/utils/collection.utils";

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

  private async getAuthorIdByMessageId(id: number): Promise<number> {
    const res = await this.getRepository().findOne({
      select: {
        authorId: true,
      },
      where: {
        id: id,
      },
    });
    return res?.authorId as number;
  }

  private async getManyIdsByChannelIdAndGuildId(channelId: string, guildId: string): Promise<Array<number>> {
    const res = await this.getRepository().find({
      select: {
        id: true,
      },
      where: {
        channelId,
        guildId,
      },
    });

    return res.map((e) => e.id);
  }
}
