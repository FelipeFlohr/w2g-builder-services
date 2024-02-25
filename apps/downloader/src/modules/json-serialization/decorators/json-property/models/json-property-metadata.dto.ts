export class JsonPropertyMetadataDTO {
  public readonly propertyName: string;
  public readonly jsonName: string;

  public constructor(propertyName: string, jsonName: string) {
    this.propertyName = propertyName;
    this.jsonName = jsonName;
  }
}
