import { JsonPropertyDecoratorProcessor } from "./json-property.processor";

export function JsonProperty(name: string) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(
      JsonPropertyDecoratorProcessor.generateKey(name),
      JsonPropertyDecoratorProcessor.generateValue(name, propertyKey),
      target,
    );
  };
}
