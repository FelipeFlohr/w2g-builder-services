import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { DiscordSlashCommand } from "../../client/business/discord-slash-command";
import { DiscordCommandRepository } from "../discord-command.repository";
import { DiscordService } from "../../services/discord.service";
import { AddListenerCommand } from "../../commands/add-listener.command";
import { CollectionUtils } from "src/utils/collection-utils";
import { HasListenerCommand } from "../../commands/has-listener.command";
import { RemoveListenerCommand } from "../../commands/remove-listener.command";
import { DelimitationMessageCommand } from "../../commands/delimitation-message.command";
import { LoggerUtils } from "src/utils/logger-utils";

@Injectable()
export class DiscordCommandRepositoryImpl
  implements DiscordCommandRepository, OnModuleInit
{
  public readonly commands: DiscordSlashCommand[];
  private readonly service: DiscordService;

  private static readonly logger = LoggerUtils.from(
    DiscordCommandRepositoryImpl,
  );

  public constructor(@Inject(DiscordService) service: DiscordService) {
    this.service = service;
    this.commands = [];
  }

  public async onModuleInit() {
    this.addCommandsToRepository();
    this.validateDuplicatedCommands();
  }

  private addCommandsToRepository(): void {
    const addListener = new AddListenerCommand(this.service);
    const hasListener = new HasListenerCommand(this.service);
    const removeListener = new RemoveListenerCommand(this.service);
    const delimitationMessage = new DelimitationMessageCommand(this.service);

    this.commands.push(
      addListener,
      hasListener,
      removeListener,
      delimitationMessage,
    );
  }

  private validateDuplicatedCommands(): void {
    for (const command of this.commands) {
      if (CollectionUtils.arrayHasDuplicatedItems(this.commands, command)) {
        const msg = `Found two or more commands with the same "${command.name}" name. Fix it.`;
        const error = new Error(msg);

        DiscordCommandRepositoryImpl.logger.fatal(error);
        throw error;
      }
    }
  }
}
