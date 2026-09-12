export type ServerActionResponse<B> = Promise<
  | { success: true; status: number; data: B }
  | {
      success: false;
      status: number;
      message: string;
      field?: string | string[];
      data?: unknown;
    }
>;

export type PaginationResponsePayload = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};
