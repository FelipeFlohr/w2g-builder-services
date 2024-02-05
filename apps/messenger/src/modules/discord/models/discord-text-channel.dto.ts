import { ApiProperty, ApiPropertyOptional, getSchemaPath } from "@nestjs/swagger";
import { DiscordTextChannelDTOOptions } from "../types/discord-text-channel-dto-options.type";
import { DiscordChannelDTO } from "./discord-channel.dto";
import { ApiPropertiesUtils } from "src/utils/api-properties-utils";
import { DiscordParentCategoryDTO } from "./discord-parent-category.dto";

export class DiscordTextChannelDTO extends DiscordChannelDTO {
  @ApiProperty(ApiPropertiesUtils.optionalString)
  public readonly lastMessageId?: string;

  @ApiPropertyOptional({
    allOf: [{ $ref: getSchemaPath(DiscordParentCategoryDTO) }],
  })
  public readonly parent?: DiscordParentCategoryDTO;

  @ApiProperty(ApiPropertiesUtils.optionalInteger)
  public readonly rateLimitPerUser?: number;

  public constructor(options: DiscordTextChannelDTOOptions) {
    super(options);
    this.lastMessageId = options.lastMessageId;
    this.rateLimitPerUser = options.rateLimitPerUser;
    if (options.parent) {
      this.parent = new DiscordParentCategoryDTO(options.parent);
    }
  }
}
