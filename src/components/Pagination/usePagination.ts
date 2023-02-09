import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import { useAltArrows } from './useAltArrows';

export const parsePage = (page: string, total: number, pageSize: number) => {
  const parsed = parseInt(page);
  const maxPage = Math.max(Math.ceil(total / pageSize), 1);
  return Math.max(Math.min(Number.isNaN(parsed) ? 1 : parsed, maxPage), 1);
};

const range = (from: number, till: number) =>
  Array.from(Array(till - from).keys()).map(k => k + from);

const getPageRange = (page: number, pageCount: number, buttonCount = 10) => {
  let first = Math.max(page - Math.floor(buttonCount / 2), 1);
  const last = Math.min(pageCount, first + buttonCount - 1);
  if (last - first < buttonCount - 1) {
    first = Math.max(last - (buttonCount - 1), 1);
  }
  return range(first, last + 1);
};

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
}

export const usePagination = ({ page, pageSize, total }: PaginationProps) => {
  const pageCount = Math.ceil(total / pageSize);

  const pathname = usePathname();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const query = useMemo(() => {
    const res = Object.fromEntries(searchParams.entries());
    delete res.page;
    return res;
  }, [searchParams]);

  const pageRange = useMemo(
    () => getPageRange(page, pageCount, 10),
    [page, pageCount],
  );

  const altNav = useCallback(
    (delta: number) => {
      const nextPage = Math.min(Math.max(page + delta, 1), pageCount);
      if (nextPage !== page) {
        push(
          `${pathname || '/'}?${new URLSearchParams(
            nextPage === 1 ? query : ({ ...query, page: nextPage } as any),
          ).toString()}`,
        );
      }
    },
    [page, pageCount, pathname, push, query],
  );

  useAltArrows(altNav);

  return {
    prev: { pathname, query: { ...query, page: Math.max(page - 1, 1) } },
    next: {
      pathname,
      query: { ...query, page: Math.min(page + 1, pageCount) },
    },
    results: {
      from: Math.min((page - 1) * pageSize + 1, total),
      to: Math.min(page * pageSize, total),
      total,
    },
    pages:
      pageCount < 2
        ? null
        : pageRange.map(p => ({
            current: p === page,
            href: { pathname, query: { ...query, page: p } },
            page: p,
          })),
  };
};
