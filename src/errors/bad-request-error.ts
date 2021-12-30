import { CustomError } from "./custom-error";
// due to an issue that is perceived by the server to be a client problem.
export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);
  }

  serializeErrors(): { message: string; field?: string | undefined; }[] {
    return [{ message: this.message }];
  }
}