// lib/types/api.types.ts

/**
 * Wrapper for all API responses that follow the `{ data: T }` convention.
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
}

/**
 * Paginated list response — contains the items plus pagination metadata.
 */
export interface PaginatedResponse<T = unknown> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Convenience alias for a paginated ApiResponse.
 */
export type PaginatedApiResponse<T = unknown> = ApiResponse<PaginatedResponse<T>>;

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
