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
