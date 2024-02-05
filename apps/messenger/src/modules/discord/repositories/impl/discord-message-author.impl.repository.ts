import { MessengerBaseTypeORMRepository } from "src/database/base/impl/messenger-base-typeorm.repository";
import { DiscordMessageAuthorTypeORMEntity } from "../../entities/impl/discord-message-author.typeorm.entity";
import { DiscordMessageAuthorRepository } from "../discord-message-author.repository";
import { DiscordMessageAuthorDTO } from "../../models/discord-message-author.dto";
import { DatabaseService } from "src/database/database.service";
import { Inject } from "@nestjs/common";

export class DiscordMessageAuthorRepositoryImpl
  extends MessengerBaseTypeORMRepository<DiscordMessageAuthorTypeORMEntity>
  implements DiscordMessageAuthorRepository
{
  public constructor(@Inject(DatabaseService) databaseService: DatabaseService) {
    super(databaseService, DiscordMessageAuthorTypeORMEntity);
  }

  public async updateAuthorById(authorId: number, authorDTO: DiscordMessageAuthorDTO): Promise<void> {
    if (!(await this.authorAlreadyExists(authorId, authorDTO))) {
      await this.getRepository()
        .createQueryBuilder()
        .update(DiscordMessageAuthorTypeORMEntity)
        .set({
          authorCreatedAt: authorDTO.createdAt,
          avatarPngUrl: authorDTO.avatarPngUrl,
          bannerPngUrl: authorDTO.bannerPngUrl,
          bot: authorDTO.bot,
          discriminator: authorDTO.discriminator,
          displayName: authorDTO.displayName,
          globalName: authorDTO.globalName,
          system: authorDTO.system,
          tag: authorDTO.tag,
          updatedAt: new Date(),
          username: authorDTO.username,
          version: () => "version + 1",
        })
        .where("id = :id", { id: authorId })
        .execute();
    }
  }

  public async saveAuthor(author: DiscordMessageAuthorDTO): Promise<number> {
    const res = await this.getRepository()
      .createQueryBuilder()
      .insert()
      .into(DiscordMessageAuthorTypeORMEntity)
      .values({
        authorCreatedAt: author.createdAt,
        authorId: author.id,
        avatarPngUrl: author.avatarPngUrl,
        bannerPngUrl: author.bannerPngUrl,
        bot: author.bot,
        discriminator: author.discriminator,
        displayName: author.displayName,
        globalName: author.globalName,
        system: author.system,
        tag: author.tag,
        username: author.username,
      })
      .returning(`"DMA_ID"`)
      .execute();

    return res.generatedMaps[0].id;
  }

  private async authorAlreadyExists(authorId: number, authorDTO: DiscordMessageAuthorDTO): Promise<boolean> {
    return await this.getRepository().existsBy({
      id: authorId,
      authorId: authorDTO.id,
      bot: authorDTO.bot,
      authorCreatedAt: authorDTO.createdAt,
      avatarPngUrl: authorDTO.avatarPngUrl,
      bannerPngUrl: authorDTO.bannerPngUrl,
      displayName: authorDTO.displayName,
      globalName: authorDTO.globalName,
    });
  }
}
