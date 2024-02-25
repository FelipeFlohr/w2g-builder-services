import { Injectable } from "@nestjs/common";
import { JsonSerializationService } from "../json-serialization.service";
import { ClassType } from "src/utils/type-utils";
import { JsonPropertyDecoratorProcessor } from "../../decorators/json-property/json-property.processor";

@Injectable()
export class JsonSerializationServiceImpl implements JsonSerializationService {
  public serialize(val: ClassType<unknown>): string {
    const jsonString = JSON.stringify(val);
    const jsonParsed = JSON.parse(jsonString) as Record<string | number | symbol, unknown>;

    const jsonRes = Object.keys(jsonParsed)
      .map((key) => {
        const customKey = JsonPropertyDecoratorProcessor.getPropertyMetadata(key, val);
        const keyToPut = customKey?.jsonName ?? key;
        return { [keyToPut]: val[key] };
      })
      .reduce((prev, curr) => {
        return { ...prev, ...curr };
      });
    return JSON.stringify(jsonRes);
  }

  public deserialize<T>(json: string, classTarget: ClassType<unknown>): T {
    const jsonObj = JSON.parse(json);

    const jsonRes = Object.entries(jsonObj)
      .map(([k, v]) => {
        const metadata = JsonPropertyDecoratorProcessor.getPropertyMetadata(k, classTarget);
        const key = metadata?.propertyName ?? k;
        return { [key]: v };
      })
      .reduce((prev, curr) => {
        return { ...prev, ...curr };
      });

    return jsonRes as T;
  }
}
