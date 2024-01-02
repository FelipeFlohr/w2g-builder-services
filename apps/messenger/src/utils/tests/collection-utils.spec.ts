import { CollectionUtils } from "../collection-utils";

describe("CollectionUtils", () => {
  it("should fetch max amount of items in collection", async () => {
    const ITEMS_TO_BE_INSERTED = 1234;
    const ITEMS_TO_SPLICE = 200;
    const array = createDummyArray(ITEMS_TO_BE_INSERTED);

    const fetchedCollection = await CollectionUtils.fetchCollection<number>(
      { maxPossibleRecordsToFetch: ITEMS_TO_SPLICE },
      async (amount) => {
        return array.fetch.splice(0, amount);
      },
    );
    expect(fetchedCollection.length).toBe(array.copy.length);
  });

  it("should fetch max amount of items in collection even if max amount is greater than collection size", async () => {
    const array = [1, 2];
    const arrayCopy = [1, 2];
    const MAX_POSSIBLE_RECORDS_TO_FETCH = 200;
    const MAX_RECORDS = 200;

    const fetchedCollection = await CollectionUtils.fetchCollection<number>(
      {
        maxPossibleRecordsToFetch: MAX_POSSIBLE_RECORDS_TO_FETCH,
        maxRecords: MAX_RECORDS,
      },
      async (amount) => {
        return array.splice(
          0,
          amount > arrayCopy.length ? array.length : amount,
        );
      },
    );
    expect(fetchedCollection.length).toBe(arrayCopy.length);
  });

  it("should fetch only max amount of items in collection", async () => {
    const ITEMS_TO_BE_INSERTED = 1234;
    const ITEMS_TO_SPLICE = 123;
    const MAX_ITEMS = 987;
    const array = createDummyArray(ITEMS_TO_BE_INSERTED);

    const fetchedCollection = await CollectionUtils.fetchCollection<number>(
      {
        maxPossibleRecordsToFetch: ITEMS_TO_SPLICE,
        maxRecords: MAX_ITEMS,
      },
      async (amount) => {
        return array.fetch.splice(0, amount);
      },
    );
    expect(ITEMS_TO_BE_INSERTED).toBeGreaterThan(MAX_ITEMS);
    expect(fetchedCollection.length).toBe(MAX_ITEMS);
  });
});

function createDummyArray(amountOfItems: number) {
  const copy: Array<number> = [];
  const fetch: Array<number> = [];

  for (let i = 0; i < amountOfItems; i++) {
    copy.push(i);
    fetch.push(i);
  }

  return {
    fetch,
    copy,
  };
}
