import { Equatable } from "./type-utils";
import { FetchCollectionOptions } from "./types/collection-utils.types";

export class CollectionUtils {
  /**
   * Fetch a collection that has a limited
   * amount of items possible to be fetched within
   * one request.
   * @param options Fetch options.
   * @param fetchFunc Fetching function. Should return
   * an array with the fetched items.
   */
  public static async fetchCollection<T>(
    options: FetchCollectionOptions,
    fetchFunc: (
      amountToFetch: number,
      lastItemFetched: T | undefined,
    ) => Promise<Array<T>>,
  ): Promise<Array<T>> {
    let records: Array<T> = [];
    let lastFetchedRecords: Array<T> = [];

    do {
      lastFetchedRecords = await fetchFunc(
        this.remainingItemsToFetch(options, records),
        records[records.length - 1],
      );
      records = [...records, ...lastFetchedRecords];
    } while (
      this.lastFetchReturnedRecords(lastFetchedRecords) &&
      !this.allRecordsFetched(options, records, lastFetchedRecords)
    );

    return records;
  }

  public static arrayHasDuplicatedItems<T extends Equatable<T>>(
    arr: Array<T>,
    val: T,
  ) {
    const results = arr.filter((i) => i.equals(val));
    return results.length > 1;
  }

  public static async asyncMap<T, U>(
    array: Array<T>,
    callbackfn: (i: T, index: number, array: Array<T>) => Promise<U>,
    parallel = true,
  ): Promise<Array<U>> {
    if (parallel) {
      const promises = array.map(callbackfn);
      return await Promise.all(promises);
    }

    const resArray: Array<U> = [];
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      const res = await callbackfn(item, i, array);
      resArray.push(res);
    }

    return resArray;
  }

  public static async asyncForEach<T>(
    array: Array<T>,
    callbackfn: (i: T, index: number, array: Array<T>) => Promise<void>,
    parallel = true,
  ) {
    if (parallel) {
      const promises = array.map(callbackfn);
      return await Promise.all(promises);
    }

    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      await callbackfn(item, i, array);
    }
  }

  public static removeDuplicated<T extends Equatable<T>>(array: Array<T>) {
    const res: Array<T> = [];
    for (const item of array) {
      if (res.every((i) => !i.equals(item))) {
        res.push(item);
      }
    }

    return res;
  }

  private constructor() {}

  private static lastFetchReturnedRecords<T>(
    lastFetchedRecords: Array<T>,
  ): boolean {
    return lastFetchedRecords.length > 0;
  }

  private static allRecordsFetched<T>(
    options: FetchCollectionOptions,
    records: Array<T>,
    lastFetchedRecords: Array<T>,
  ): boolean {
    return (
      options.maxRecords === records.length ||
      lastFetchedRecords.length < options.maxPossibleRecordsToFetch
    );
  }

  private static remainingItemsToFetch<T>(
    options: FetchCollectionOptions,
    records: Array<T>,
  ): number {
    if (options.maxRecords == undefined) {
      return options.maxPossibleRecordsToFetch;
    }

    const nextFetchWillBypassLimit =
      records.length + options.maxPossibleRecordsToFetch > options.maxRecords;
    if (nextFetchWillBypassLimit) {
      return options.maxRecords - records.length;
    }
    return options.maxPossibleRecordsToFetch;
  }
}
