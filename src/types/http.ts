export type ServerActionResponse<B> = Promise<
  { success: true; data: B } | { success: false; error: string; data?: unknown }
>;
