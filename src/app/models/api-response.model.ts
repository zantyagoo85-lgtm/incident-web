export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: {
    timestamp: string;
    traceId: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  nextPageNumber?: number;
}
