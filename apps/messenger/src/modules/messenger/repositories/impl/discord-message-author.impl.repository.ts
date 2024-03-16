import { MessengerBaseTypeORMRepository } from "src/modules/database/base/impl/messenger-base-typeorm.repository";
import { DiscordMessageAuthorTypeORMEntity } from "../../entities/impl/discord-message-author.typeorm.entity";
import { Inject, Injectable } from "@nestjs/common";
import { DatabaseServiceProvider } from "src/modules/database/providers/database-service.provider";
import { DatabaseService } from "src/modules/database/services/database.service";
import { TypeUtils } from "src/utils/type.utils";
import { DiscordMessageAuthorRepository } from "../discord-message-author.repository";

@Injectable()
export class DiscordMessageAuthorRepositoryImpl
  extends MessengerBaseTypeORMRepository<DiscordMessageAuthorTypeORMEntity>
  implements DiscordMessageAuthorRepository
{
  public constructor(@Inject(DatabaseServiceProvider) databaseService: DatabaseService) {
    super(databaseService, DiscordMessageAuthorTypeORMEntity);
  }

  public async getById(id: number): Promise<DiscordMessageAuthorTypeORMEntity | undefined> {
    const res = await this.getRepository().findOneBy({ id });
    return TypeUtils.parseNullToUndefined(res);
  }

  public async deleteById(id: number): Promise<number | undefined> {
    if (await this.existsById(id)) {
      await this.getRepository().delete(id);
      return id;
    }
  }

  public async existsById(id: number): Promise<boolean> {
    return await this.getRepository().existsBy({ id });
  }
}
