export interface PaginationResponse<T> {
  cursor: number;
  hasMore: boolean;
  total: number;
  items: T[];
}

export interface PaginationArgs {
	cursor: number
	limit?: number
	sortBy?: string
	sortDirection?: PaginationSortDirections
}

export enum PaginationSortDirections {
	ASC = 'ASC',
	DESC = 'DESC'
}
