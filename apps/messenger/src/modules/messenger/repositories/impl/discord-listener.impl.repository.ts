import { MessengerBaseTypeORMRepository } from "src/modules/database/base/impl/messenger-base-typeorm.repository";
import { DiscordListenerTypeORMEntity } from "../../entities/impl/discord-listener.typeorm.entity";
import { Inject, Injectable } from "@nestjs/common";
import { DatabaseServiceProvider } from "src/modules/database/providers/database-service.provider";
import { DatabaseService } from "src/modules/database/services/database.service";
import { TypeUtils } from "src/utils/type.utils";
import { DiscordListenerRepository } from "../discord-listener.repository";

@Injectable()
export class DiscordListenerRepositoryImpl
  extends MessengerBaseTypeORMRepository<DiscordListenerTypeORMEntity>
  implements DiscordListenerRepository
{
  public constructor(@Inject(DatabaseServiceProvider) databaseService: DatabaseService) {
    super(databaseService, DiscordListenerTypeORMEntity);
  }

  public async getById(id: number): Promise<DiscordListenerTypeORMEntity | undefined> {
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
