import { Prisma } from "@/database/generated/client";

export type PrismaError =
  | "NOT_FOUND"
  | "UNIQUE_CONSTRAINT_ERROR"
  | "FOREIGN_KEY_ERROR"
  | "CASCADE_RELATION_ERROR"
  | "UNKNOWN_ERROR";

export type LeanPrismaErrorResult = {
  errType: PrismaError;
  field?: string;
};

export class PrismaClientError extends Error {
  public message: string;
  public errType: PrismaError;
  public field?: string;
  constructor(
    message: string,
    errType: PrismaError,
    field?: string,
  ) {
    super(message);
    this.message = message;
    this.errType = errType;
    this.field = field;

    Object.setPrototypeOf(this, new.target.prototype);
  }

  static getLeanError(err: Prisma.PrismaClientKnownRequestError) {
    const result: LeanPrismaErrorResult = {
      errType: "UNKNOWN_ERROR",
    };

    switch (err.code) {
      case "P2002": {
        result.errType = "UNIQUE_CONSTRAINT_ERROR";
        const match = err.message.match(/constraint: `([^`]+)`/)?.at(1);
        if (match) result.field = match;
        break;
      }
      case "P2025": {
        result.errType = "NOT_FOUND";
        break;
      }
      case "P2003": {
        result.errType = "FOREIGN_KEY_ERROR";
        const match = err.message.match(/constraint: `([^`]+)`/)?.at(1);
        if (match) result.field = match;
        break;
      }
      case "P2014": {
        result.errType = "CASCADE_RELATION_ERROR";
        break;
      }
    }

    return new PrismaClientError(err.message, result.errType, result.field);
  }
}
