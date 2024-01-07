import { ApiProperty } from "@nestjs/swagger";
import { DiscordGuildInfoDTOOptions } from "../types/discord-guild-info-dto-options.type";
import { ApiPropertiesUtils } from "src/utils/api-properties-utils";

export class DiscordGuildInfoDTO {
  @ApiProperty(ApiPropertiesUtils.requiredString)
  public readonly id: string;

  @ApiProperty(ApiPropertiesUtils.requiredBoolean)
  public readonly verified: boolean;

  @ApiProperty(ApiPropertiesUtils.requiredTimestamp)
  public readonly createdAt: Date;

  @ApiProperty(ApiPropertiesUtils.optionalString)
  public readonly iconPngUrl?: string;

  @ApiProperty(ApiPropertiesUtils.optionalString)
  public readonly iconJpegUrl?: string;

  @ApiProperty(ApiPropertiesUtils.optionalString)
  public readonly iconGifUrl?: string;

  public constructor(options: DiscordGuildInfoDTOOptions) {
    this.id = options.id;
    this.verified = options.verified;
    this.createdAt = options.createdAt;
    this.iconPngUrl = options.iconPngUrl;
    this.iconJpegUrl = options.iconJpegUrl;
    this.iconGifUrl = options.iconGifUrl;
  }
}
