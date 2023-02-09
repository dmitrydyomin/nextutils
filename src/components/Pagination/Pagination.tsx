import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

import { PaginationProps, usePagination } from './usePagination';

import styles from './Pagination.module.css';

export const Pagination: React.FC<PaginationProps> = props => {
  const { prev, next, pages, results } = usePagination(props);

  return (
    <div className={styles.container}>
      <div className={styles.small}>
        <Link href={prev} className={styles.smallPrev}>
          Назад
        </Link>
        <Link href={next} className={styles.smallNext}>
          Вперед
        </Link>
      </div>

      <div className={styles.large}>
        <div>
          <p className={styles.results}>
            Результаты с <span>{results.from}</span> по{' '}
            <span>{results.to}</span> из <span>{results.total}</span>
          </p>
        </div>

        {pages && (
          <div>
            <nav aria-label="Пагинация">
              <Link href={prev} className={styles.prev}>
                <span className="sr-only">Назад</span>
                <ChevronLeftIcon className={styles.icon} aria-hidden="true" />
              </Link>

              {pages.map(p => (
                <Link
                  aria-current={p.current ? 'page' : undefined}
                  className={p.current ? styles.pageCurrent : styles.page}
                  href={p.href}
                  key={p.page}
                >
                  {p.page}
                </Link>
              ))}

              <Link href={next} className={styles.next}>
                <span className="sr-only">Вперед</span>
                <ChevronRightIcon className={styles.icon} aria-hidden="true" />
              </Link>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};
