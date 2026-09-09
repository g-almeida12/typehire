export type LeanPrismaErrorResult = {
  statusCode: number;
  field: string | string[] | undefined;
  cause: string | undefined;
};

export class AppError extends Error {
  public message: string;
  public statusCode: number;
  public field: string | string[] | undefined;
  public cause: string | undefined;
  constructor(
    message: string,
    statusCode: number,
    field?: string | string[],
    cause?: string,
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.field = field;
    this.cause = cause;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
