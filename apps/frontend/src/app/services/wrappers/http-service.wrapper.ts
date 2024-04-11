export class HttpServiceWrapper {
  public static async get<T>(url: string): Promise<T> {
    const data = await fetch(url);
    return (await data.json()) as T;
  }
}
