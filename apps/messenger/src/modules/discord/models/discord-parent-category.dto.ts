import { ApiProperty } from "@nestjs/swagger";
import { DiscordParentCategoryDTOOptions } from "../types/discord-parent-category-dto-options.type";
import { ApiPropertiesUtils } from "src/utils/api-properties-utils";

export class DiscordParentCategoryDTO {
  @ApiProperty(ApiPropertiesUtils.requiredString)
  public readonly id: string;

  @ApiProperty(ApiPropertiesUtils.requiredString)
  public readonly name: string;

  public constructor(options: DiscordParentCategoryDTOOptions) {
    this.id = options.id;
    this.name = options.name;
  }
}
