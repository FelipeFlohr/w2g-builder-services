import { ApiProperty } from "@nestjs/swagger";
import { DiscordGuildDTOOptions } from "../types/discord-guild-dto-options.type";
import { ApiPropertiesUtils } from "src/utils/api-properties-utils";

export class DiscordGuildDTO {
  @ApiProperty(ApiPropertiesUtils.optionalString)
  public readonly applicationId?: string;

  @ApiProperty(ApiPropertiesUtils.requiredInteger)
  public readonly memberCount: number;

  @ApiProperty(ApiPropertiesUtils.requiredBoolean)
  public readonly available: boolean;

  @ApiProperty(ApiPropertiesUtils.requiredTimestamp)
  public readonly createdAt: Date;

  @ApiProperty(ApiPropertiesUtils.requiredString)
  public readonly id: string;

  @ApiProperty(ApiPropertiesUtils.requiredTimestamp)
  public readonly joinedAt: Date;

  @ApiProperty(ApiPropertiesUtils.requiredString)
  public readonly ownerId: string;

  @ApiProperty(ApiPropertiesUtils.requiredString)
  public readonly name: string;

  @ApiProperty(ApiPropertiesUtils.requiredBoolean)
  public readonly large: boolean;

  public constructor(options: DiscordGuildDTOOptions) {
    this.applicationId = options.applicationId;
    this.memberCount = options.memberCount;
    this.available = options.available;
    this.createdAt = options.createdAt;
    this.id = options.id;
    this.joinedAt = options.joinedAt;
    this.ownerId = options.ownerId;
    this.name = options.name;
    this.large = options.large;
  }
}
