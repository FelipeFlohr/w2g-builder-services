import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class DecodeQueryPipe implements PipeTransform {
  public transform(value: any) {
    try {
      return decodeURIComponent(value);
    } catch (e) {
      return value;
    }
  }
}
