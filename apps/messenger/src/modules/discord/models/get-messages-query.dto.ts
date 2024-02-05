import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class GetMessagesQueryDTO {
  @ApiProperty({
    description: "Filters by messages after the passed ID",
    format: "string",
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly after?: string;

  @ApiProperty({
    description: "Filters by messages around the passed ID",
    format: "string",
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly around?: string;

  @ApiProperty({
    description: "Filters by messages before the passed ID",
    format: "string",
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly before?: string;

  @ApiProperty({
    description: "Limits the amount of records to be fetched. No value means that it will retrieve all the messages",
    format: "integer",
    required: false,
  })
  public readonly limit?: number;

  public constructor(after?: string, around?: string, before?: string, limit?: number) {
    this.after = after;
    this.around = around;
    this.before = before;
    this.limit = limit;
  }
}
