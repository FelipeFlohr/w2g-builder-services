import { ApiProperty } from "@nestjs/swagger";
import { DiscordChannelDTOOptions } from "../types/discord-channel-dto-options.type";
import { ApiPropertiesUtils } from "src/utils/api-properties-utils";

export class DiscordChannelDTO {
  @ApiProperty(ApiPropertiesUtils.requiredTimestamp)
  public readonly createdAt: Date;

  @ApiProperty(ApiPropertiesUtils.requiredString)
  public readonly id: string;

  @ApiProperty(ApiPropertiesUtils.requiredBoolean)
  public readonly manageable: boolean;

  @ApiProperty(ApiPropertiesUtils.requiredString)
  public readonly name: string;

  @ApiProperty(ApiPropertiesUtils.requiredString)
  public readonly url: string;

  @ApiProperty(ApiPropertiesUtils.requiredBoolean)
  public readonly viewable: boolean;

  public constructor(options: DiscordChannelDTOOptions) {
    this.createdAt = options.createdAt;
    this.id = options.id;
    this.manageable = options.manageable;
    this.name = options.name;
    this.url = options.url;
    this.viewable = options.viewable;
  }
}
