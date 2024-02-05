import { Inject, Injectable } from "@nestjs/common";
import { DiscordSlashCommandHandler } from "../discord-slash-command.handler";
import { DiscordCommandRepository } from "../../repositories/discord-command.repository";
import { DiscordSlashCommandInteraction } from "../../client/business/discord-slash-command-interaction";

@Injectable()
export class DiscordSlashCommandHandlerImpl implements DiscordSlashCommandHandler {
  private readonly repository: DiscordCommandRepository;

  public constructor(@Inject(DiscordCommandRepository) repository: DiscordCommandRepository) {
    this.repository = repository;
  }

  public async handleSlashCommandByInteraction(interaction: DiscordSlashCommandInteraction): Promise<void> {
    const command = this.repository.commands.find((c) => c.name === interaction.commandName);
    await command?.onInteraction(interaction);
  }
}
