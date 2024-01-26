import { Inject, Injectable } from "@nestjs/common";
import { DiscordMessageDTO } from "../../models/discord-message.dto";
import { DiscordDelimitationMessageRepository } from "../discord-delimitation-message.repository";
import { DatabaseService } from "src/database/database.service";
import { MessengerBaseTypeORMRepository } from "src/database/base/impl/messenger-base-typeorm.repository";
import { DiscordDelimitationMessageTypeORMEntity } from "../../entities/impl/discord-delimitation-message.typeorm.entity";
import { DiscordMessageRepository } from "../discord-messasge.repository";

@Injectable()
export class DiscordDelimitationMessageRepositoryImpl
  extends MessengerBaseTypeORMRepository<DiscordDelimitationMessageTypeORMEntity>
  implements DiscordDelimitationMessageRepository
{
  private readonly messageRepository: DiscordMessageRepository;

  public constructor(
    @Inject(DatabaseService) databaseService: DatabaseService,
    @Inject(DiscordMessageRepository)
    messageRepository: DiscordMessageRepository,
  ) {
    super(databaseService, DiscordDelimitationMessageTypeORMEntity);
    this.messageRepository = messageRepository;
  }

  public async saveDelimitation(message: DiscordMessageDTO): Promise<number> {
    const messagePersisted = await this.messageRepository.saveMessage(message);

    const res = await this.getRepository().save({
      message: {
        id: messagePersisted,
      },
    });
    return res.id;
  }
}
