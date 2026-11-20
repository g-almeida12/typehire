import { z } from "zod";

export class AppError extends Error {
  public message: string;
  public statusCode: number;
  public field?: string | Record<string, string[]>;
  constructor(
    message: string,
    statusCode: number,
    field?: string | Record<string, string[]>,
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.field = field;

    Object.setPrototypeOf(this, new.target.prototype);
  }

  static handleDefaultError(
    err: any,
    defaultMessage: string,
  ): {
    success: false;
    status: number;
    message: string;
    field?: string | Record<string, string[]>;
  } {
    if (err instanceof z.ZodError) {
      console.error("APP ERROR: ", {
        root: z.flattenError(err).formErrors,
        ...z.flattenError(err).fieldErrors,
      });
      return {
        success: false,
        status: 400,
        message: "Payload inválido fornecido.",
        field: {
          root: z.flattenError(err).formErrors,
          ...z.flattenError(err).fieldErrors,
        },
      };
    }

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
