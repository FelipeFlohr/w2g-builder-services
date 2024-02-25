export class URLUtils {
  public static removeQueryParams(url: string): string {
    const urlObj = new URL(url);
    urlObj.search = "";
    return urlObj.toString();
  }
}
