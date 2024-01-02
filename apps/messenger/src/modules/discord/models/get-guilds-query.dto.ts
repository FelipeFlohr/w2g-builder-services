import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";

export class GetGuildsQueryDTO {
  @ApiProperty({
    description: "Filters by guilds after the passed ID",
    format: "string",
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly after?: string;

  @ApiProperty({
    description: "Filters by guilds before the passed ID",
    format: "string",
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly before?: string;

  @ApiProperty({
    description:
      "Limits the amount of records to be fetched. No value means that it will retrieve all the guilds",
    format: "integer",
    required: false,
  })
  @IsInt()
  @IsOptional()
  public readonly amount?: number;

  public constructor(after?: string, before?: string, amount?: number) {
    this.after = after;
    this.before = before;
    this.amount = amount;
  }
}
