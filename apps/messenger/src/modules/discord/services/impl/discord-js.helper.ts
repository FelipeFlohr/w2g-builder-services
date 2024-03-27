import {
  CacheType,
  Client,
  CommandInteraction,
  GatewayIntentBits,
  Guild,
  GuildBasedChannel,
  Message,
  NonThreadGuildBasedChannel,
  OAuth2Guild,
  PartialMessage,
  Partials,
  SlashCommandBuilder,
  User,
} from "discord.js";
import { DiscordMessageAuthorDTO } from "src/models/discord-message-author.dto";
import { DiscordMessageDTO } from "src/models/discord-message.dto";
import { TypeUtils } from "src/utils/type.utils";
import { DiscordParameterTypeEnum } from "../../enums/discord-parameter-type.enum";
import { DiscordChannelDTO } from "../../models/discord-channel.dto";
import { DiscordGuildInfoDTO } from "../../models/discord-guild-info.dto";
import { DiscordGuildDTO } from "../../models/discord-guild.dto";
import { DiscordSlashCommandInteractionDTO } from "../../models/discord-slash-command-interaction.dto";
import { DiscordSlashCommandParameterDTO } from "../../models/discord-slash-command-parameter.dto";
import { DiscordSlashCommandDTO } from "../../models/discord-slash-command.dto";

export class DiscordJsHelper {
  private static readonly intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ] as const;
  private static readonly partials = [Partials.Message];

  public constructor() {}

  public createClient(): Client<false> {
    return new Client({
      intents: DiscordJsHelper.intents,
      partials: DiscordJsHelper.partials,
    });
  }

  public OAuth2GuildToGuildInfoDTO(guild: OAuth2Guild): DiscordGuildInfoDTO {
    return new DiscordGuildInfoDTO({
      createdAt: guild.createdAt,
      id: guild.id,
      verified: guild.verified,
      iconGifUrl: TypeUtils.parseNullToUndefined(
        guild.iconURL({
          extension: "gif",
          forceStatic: false,
          size: 512,
        }),
      ),
      iconJpegUrl: TypeUtils.parseNullToUndefined(
        guild.iconURL({
          extension: "jpeg",
          forceStatic: true,
          size: 512,
        }),
      ),
      iconPngUrl: TypeUtils.parseNullToUndefined(
        guild.iconURL({
          extension: "png",
          forceStatic: true,
          size: 512,
        }),
      ),
    });
  }

  public guildToGuildDTO(guild: Guild): DiscordGuildDTO {
    return new DiscordGuildDTO({
      available: guild.available,
      createdAt: guild.createdAt,
      id: guild.id,
      joinedAt: guild.joinedAt,
      large: guild.large,
      memberCount: guild.memberCount,
      name: guild.name,
      ownerId: guild.ownerId,
      applicationId: guild.ownerId,
      iconGifUrl: TypeUtils.parseNullToUndefined(guild.iconURL({ extension: "gif", size: 512 })),
      iconJpegUrl: TypeUtils.parseNullToUndefined(guild.iconURL({ extension: "jpeg", size: 512 })),
      iconPngUrl: TypeUtils.parseNullToUndefined(guild.iconURL({ extension: "png", size: 512 })),
    });
  }

  public discordJsChannelToChannelDTO(channel: NonThreadGuildBasedChannel | GuildBasedChannel): DiscordChannelDTO {
    return new DiscordChannelDTO({
      createdAt: channel.createdAt ?? new Date(),
      id: channel.id,
      manageable: channel.manageable,
      name: channel.name,
      url: channel.url,
      viewable: channel.viewable,
    });
  }

  public discordJsMessageToMessageDTO(message: Message<boolean> | PartialMessage): DiscordMessageDTO {
    return new DiscordMessageDTO({
      author: this.userToAuthorDTO(message.author as User),
      cleanContent: message.cleanContent ?? "",
      content: message.content ?? "",
      createdAt: message.createdAt,
      hasThread: message.hasThread,
      id: message.id,
      pinnable: message.pinnable,
      pinned: message.pinned ?? false,
      system: message.system ?? false,
      url: message.url,
      applicationId: TypeUtils.parseNullToUndefined(message.applicationId),
      position: TypeUtils.parseNullToUndefined(message.position),
      channelId: message.channelId,
      guildId: message.guildId ?? "",
    });
  }

  private userToAuthorDTO(user: User): DiscordMessageAuthorDTO {
    return new DiscordMessageAuthorDTO({
      bot: user.bot,
      createdAt: user.createdAt,
      discriminator: user.discriminator,
      displayName: user.displayName,
      id: user.id,
      system: user.system,
      tag: user.tag,
      username: user.username,
      avatarPngUrl: TypeUtils.parseNullToUndefined(
        user.avatarURL({
          extension: "png",
          forceStatic: true,
          size: 512,
        }),
      ),
      bannerPngUrl: TypeUtils.parseNullToUndefined(
        user.bannerURL({
          extension: "png",
          forceStatic: true,
          size: 512,
        }),
      ),
      globalName: TypeUtils.parseNullToUndefined(user.globalName),
    });
  }

  public slashCommandDTOToSlashCommandBuilder(command: DiscordSlashCommandDTO): SlashCommandBuilder {
    const slashBuilder = new SlashCommandBuilder()
      .setName(command.name)
      .setDescription(command.description)
      .setDMPermission(command.dmPermission);
    this.buildSlashParameters(slashBuilder, command);
    return slashBuilder;
  }

  public async fetchMessageIfNotFetched(message: Message<boolean> | PartialMessage): Promise<Message<true>> {
    if (message.content != "" && message.cleanContent != "") {
      return message as Message<true>;
    }
    return (await message.fetch()) as Message<true>;
  }

  public commandInteractionToInteractionDTO(
    interaction: CommandInteraction<CacheType>,
  ): DiscordSlashCommandInteractionDTO {
    const data: Record<string, unknown> = {};
    for (const val of interaction.options.data) {
      data[val.name] = val.value;
    }

    return new DiscordSlashCommandInteractionDTO({
      channelId: interaction.channelId,
      guildId: TypeUtils.parseNullToUndefined(interaction.guildId),
      commandName: interaction.commandName,
      data: data,
    });
  }

  private buildSlashParameters(slashBuilder: SlashCommandBuilder, command: DiscordSlashCommandDTO): void {
    if (command.parameters) {
      for (const parameter of command.parameters) {
        switch (parameter.type) {
          case DiscordParameterTypeEnum.INTEGER:
            this.buildIntegerParameter(slashBuilder, parameter);
            break;
          case DiscordParameterTypeEnum.STRING:
            this.buildStringParameter(slashBuilder, parameter);
            break;
        }
      }
    }
  }

  private buildIntegerParameter(slashBuilder: SlashCommandBuilder, parameter: DiscordSlashCommandParameterDTO): void {
    slashBuilder.addIntegerOption((builder) => {
      builder.setDescription(parameter.description).setName(parameter.name).setRequired(parameter.required);
      return builder;
    });
  }

  private buildStringParameter(slashBuilder: SlashCommandBuilder, parameter: DiscordSlashCommandParameterDTO): void {
    slashBuilder.addStringOption((builder) => {
      builder.setDescription(parameter.description).setName(parameter.name).setRequired(parameter.required);
      return builder;
    });
  }
}
