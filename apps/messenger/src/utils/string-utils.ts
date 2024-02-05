export class StringUtils {
  private static readonly EMPTY_STRING = "";
  private static readonly defaultPluralProcessor = (msg: string) => `${msg}s`;

  public static pluralHandler(amount: number, msg: string): string;
  public static pluralHandler(amount: number, msg: string, handler: (msg: string) => string): string;
  public static pluralHandler(amount: number, msg: string, handler?: (msg: string) => string): string {
    handler = handler ?? this.defaultPluralProcessor;
    if (amount > 1) {
      return handler(msg);
    }
    return msg;
  }

  public static isNotBlank(str?: string): str is string {
    return str?.trim() != StringUtils.EMPTY_STRING;
  }
}
