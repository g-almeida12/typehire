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

  static handleDefaultError(err: any, defaultMessage: string): {
    success: false;
    status: number;
    message: string;
    field?: string | string[];
    data?: unknown;
  } {
    if (err instanceof AppError) {
      return {
        success: false,
        status: err.statusCode,
        message: err.message,
        field: err.field,
      };
    }

    return {
      success: false,
      status: 500,
      message: defaultMessage,
    };
  }
}
