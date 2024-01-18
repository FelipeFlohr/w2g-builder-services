import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { DiscordSlashCommand } from "../../client/business/discord-slash-command";
import { DiscordCommandRepository } from "../discord-command.repository";
import { DiscordService } from "../../services/discord.service";
import { AddListenerCommand } from "../../commands/add-listener.command";

@Injectable()
export class DiscordCommandRepositoryImpl
  implements DiscordCommandRepository, OnModuleInit
{
  public readonly commands: DiscordSlashCommand[];
  private readonly service: DiscordService;

  public constructor(@Inject(DiscordService) service: DiscordService) {
    this.service = service;
    this.commands = [];
  }

  public async onModuleInit() {
    const addListener = new AddListenerCommand(this.service);

    this.commands.push(addListener);
  }
}
