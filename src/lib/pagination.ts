export interface PaginationProps {
  page: number;
  lastPage: number;
  url: {
    prev: string | undefined;
    next: string | undefined;
  };
}

export function paginate<T>(
  items: T[],
  { page = 1, pageSize = 10 }: { page?: number; pageSize?: number }
): { items: T[]; pagination: PaginationProps; totalPages: number } {
  const totalPages = Math.ceil(items.length / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: items.slice(start, end),
    totalPages,
    pagination: {
      page,
      lastPage: totalPages,
      url: {
        prev: page > 1 ? (page - 1 === 1 ? '' : `${page - 1}`) : undefined,
        next: page < totalPages ? `${page + 1}` : undefined,
      },
    },
  };
}
