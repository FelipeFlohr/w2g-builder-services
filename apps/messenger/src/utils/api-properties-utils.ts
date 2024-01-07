import { ApiPropertyOptions } from "@nestjs/swagger";

export class ApiPropertiesUtils {
  public static readonly optionalString: ApiPropertyOptions = {
    type: "string",
    required: false,
  } as const;

  public static readonly optionalInteger: ApiPropertyOptions = {
    type: "integer",
    required: false,
  } as const;

  public static readonly requiredInteger: ApiPropertyOptions = {
    type: "integer",
    required: true,
  } as const;

  public static readonly requiredBoolean: ApiPropertyOptions = {
    type: "boolean",
    required: true,
  } as const;

  public static readonly requiredTimestamp: ApiPropertyOptions = {
    type: "string",
    format: "date-time",
    required: true,
  } as const;

  public static readonly requiredString: ApiPropertyOptions = {
    type: "string",
    required: true,
  } as const;

  private constructor() {}
}
