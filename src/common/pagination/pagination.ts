export type Paginated<T> = {
  data: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export class Pagination {
  static create<T>({
    data,
    page,
    pageSize,
    totalItems,
  }: {
    data: T[];
    page: number;
    pageSize: number;
    totalItems: number;
  }): Paginated<T> {
    const totalPages = Math.ceil(totalItems / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    return {
      data,
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };
  }

  static calculateOffset(page: number, pageSize: number): number {
    return (page - 1) * pageSize;
  }
}
