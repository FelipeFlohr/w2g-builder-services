import { ClassType } from "src/utils/type-utils";

export interface JsonSerializationService {
  serialize(val: ClassType<unknown>): string;
  deserialize<T>(json: string, classTarget: ClassType<unknown>): T;
}

export const JsonSerializationService = Symbol("JsonSerializationService");
