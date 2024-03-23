export type FetchCollectionOptionsType = {
  /**
   * Max amount of records that is possible
   * to fetch within one request.
   * @example 200 (Discord API)
   */
  readonly maxPossibleRecordsToFetch: number;
  /**
   * Max amount of records to fetch.
   * If no value is passed, it will retrieve
   * until there is no more record to be
   * fetched.
   */
  readonly maxRecords?: number;
};
