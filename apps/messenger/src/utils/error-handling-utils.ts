import { HttpException, UnprocessableEntityException, ValidationError } from "@nestjs/common";

export class ErrorHandlingUtils {
  public static handleValidationErrors(errors: Array<ValidationError>): HttpException {
    const fields = errors.map((err) => err.property).reduce((prev, curr) => `${prev}, ${curr}`);

    return new UnprocessableEntityException(`The fields ${fields} are invalid.`);
  }

  private constructor() {}
}
