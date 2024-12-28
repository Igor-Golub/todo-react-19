import { use, useTransition } from "react";
import { PaginatedResponse } from "../../../shared/types.ts";

interface Props<T> {
  onPageChange?: (page: number) => void;
  tasksPaginated: Promise<PaginatedResponse<T>>;
}

export function Pagination<T>({ tasksPaginated, onPageChange }: Props<T>) {
  const [isLoading, startTransition] = useTransition();

  const { last, page, first, next, prev, pages } = use(tasksPaginated);

  const handlePageChange = (page: number) => () => {
    startTransition(() => onPageChange?.(page));
  };

  return (
    <nav
      className={`${
        isLoading ? "opacity-50" : ""
      } flex items-center justify-between`}
    >
      <div className="grid grid-cols-4 gap-2">
        <button
          disabled={isLoading}
          className="px-3 py-2 rounded-l"
          onClick={handlePageChange(first)}
        >
          First ({first})
        </button>

        {prev && (
          <button
            disabled={isLoading}
            className="px-3 py-2"
            onClick={handlePageChange(prev)}
          >
            Prev ({prev})
          </button>
        )}

        {next && (
          <button
            disabled={isLoading}
            className="px-3 py-2"
            onClick={handlePageChange(next)}
          >
            Next ({next})
          </button>
        )}

        <button
          disabled={isLoading}
          className="px-3 py-2 rounded-r"
          onClick={handlePageChange(last)}
        >
          Last ({last})
        </button>
      </div>

      <span className="text-sm">
        Page {page} of {pages}
      </span>
    </nav>
  );
}
