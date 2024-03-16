import { MessengerBaseTypeORMRepository } from "src/modules/database/base/impl/messenger-base-typeorm.repository";
import { DiscordDelimitationMessageTypeORMEntity } from "../../entities/impl/discord-delimitation-message.typeorm.entity.impl";
import { Inject, Injectable } from "@nestjs/common";
import { DatabaseServiceProvider } from "src/modules/database/providers/database-service.provider";
import { DatabaseService } from "src/modules/database/services/database.service";
import { TypeUtils } from "src/utils/type.utils";
import { DiscordMessageRepository } from "../discord-message.repository";
import { DiscordMessageRepositoryProvider } from "../../providers/discord-message-repository.provider";
import { DiscordDelimitationMessageRepository } from "../discord-delimitation-message.repository";

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
      const messageId = await this.getMessageIdByDelimitationMessageId(id);
      await this.messageRepository.deleteById(messageId);
      await this.getRepository().delete(id);
      return id;
    }
  }

  public async existsById(id: number): Promise<boolean> {
    return await this.getRepository().existsBy({ id });
  }

  private async getMessageIdByDelimitationMessageId(id: number): Promise<number> {
    const res = await this.getRepository().findOne({
      select: {
        messageId: true,
      },
      where: {
        id,
      },
    });
    return res?.messageId as number;
  }
}
