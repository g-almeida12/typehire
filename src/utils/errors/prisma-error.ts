import { Prisma } from "@/database/generated/client";

export type PrismaError =
  | "NOT_FOUND"
  | "UNIQUE_CONSTRAINT_ERROR"
  | "FOREIGN_KEY_ERROR"
  | "CASCADE_RELATION_ERROR"
  | "UNKNOWN_ERROR";

export type LeanPrismaErrorResult = {
  errType: PrismaError;
  field: string | string[] | undefined;
  cause: string | undefined;
};

export class PrismaClientError extends Error {
  public message: string;
  public errType: PrismaError;
  public field: string | string[] | undefined;
  public cause: string | undefined;
  constructor(
    message: string,
    errType: PrismaError,
    field?: string | string[],  
    cause?: string,
  ) {
    super(message);
    this.message = message;
    this.errType = errType;
    this.field = field;
    this.cause = cause;

    Object.setPrototypeOf(this, new.target.prototype);
  }

  static getLeanError(err: Prisma.PrismaClientKnownRequestError) {
    const result: LeanPrismaErrorResult = {
      errType: "UNKNOWN_ERROR",
      field: undefined,
      cause: undefined,
    };

    switch (err.code) {
      case "P2002": {
        result.errType = "UNIQUE_CONSTRAINT_ERROR";
        result.field = err.meta?.target as string | string[];
        break;
      }
      case "P2025": {
        result.errType = "NOT_FOUND";
        result.cause = err.meta?.cause as string;
        break;
      }
      case "P2003": {
        result.errType = "FOREIGN_KEY_ERROR";
        result.field = err.meta?.field_name as string;
        break;
      }
      case "P2014": {
        result.errType = "CASCADE_RELATION_ERROR";
        result.cause = err.meta?.cause as string;
        break;
      }
      default: {
        result.cause = err.message;
        break;
      }
    }

    return new PrismaClientError(
      err.message,
      result.errType,
      result.field,
      result.cause,
    );
  }
}
