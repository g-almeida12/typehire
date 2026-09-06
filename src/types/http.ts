export type ServerActionResponse<B> = Promise<
  { success: true; data: B } | { success: false; message: string; data?: unknown }
>;
