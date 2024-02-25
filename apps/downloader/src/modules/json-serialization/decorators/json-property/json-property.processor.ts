import { ClassType } from "src/utils/type-utils";
import { JsonPropertyMetadataDTO } from "./models/json-property-metadata.dto";

export class JsonPropertyDecoratorProcessor {
  public static readonly JSON_PROPERTY_METADATA_KEY_PREFIX = "JSON_PROPERTY_";

  public static generateKey(name: string) {
    return `${this.JSON_PROPERTY_METADATA_KEY_PREFIX}${name}`;
  }

  public static generateValue(name: string, propertyKey: string): JsonPropertyMetadataDTO {
    return new JsonPropertyMetadataDTO(propertyKey, name);
  }

  public static getPropertyMetadata(
    propertyKey: string,
    target: ClassType<unknown>,
  ): JsonPropertyMetadataDTO | undefined {
    const metadataKey = `${JsonPropertyDecoratorProcessor.JSON_PROPERTY_METADATA_KEY_PREFIX}${propertyKey}`;
    const metadata = Reflect.getMetadata(metadataKey, target.prototype) as JsonPropertyMetadataDTO | undefined;
    if (metadata instanceof JsonPropertyMetadataDTO) return metadata;
  }
}
