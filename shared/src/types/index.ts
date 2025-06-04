export type ApiResponse<T = unknown> = {
    message: string;
    success: boolean;
    error?: Error;
    data: T;
};
