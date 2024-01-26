export class MessageIsAlreadyDelimitationError extends Error {
  public constructor() {
    super("This message is already a delimitation.");
  }
}
