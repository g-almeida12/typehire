"use client";

import { useEffect, useState } from "react";
import { Button } from "../common/Button";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { PaginationResponsePayload } from "@/utils/types";

export type ModuleResponse<TModule> =
  | {
      success: true;
      data: {
        modules: TModule[];
        pagination: PaginationResponsePayload;
      };
    }
  | { success: false; message: string };

interface ModuleListViewProps<TModule, TFilter> {
  getModulesAction: (
    filter: TFilter,
    page?: number,
    pageSize?: number,
  ) => Promise<ModuleResponse<TModule>>;
  filter: TFilter;
  renderItem: (module: TModule) => React.ReactNode;
  errorMessage: string;
  modulesListEndMessage: string;
  initialModules?: TModule[];
  initialHasMore?: boolean;
}

export function ModuleListView<TModule, TFilter>({
  getModulesAction,
  filter,
  renderItem,
  initialModules = [],
  initialHasMore = true,
  errorMessage,
  modulesListEndMessage,
}: ModuleListViewProps<TModule, TFilter>) {
  const [modules, setModules] = useState<TModule[]>(initialModules);
  const [page, setPage] = useState<number>(2);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null);

  const loadMoreModules = async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      setError(null);
      const result = await getModulesAction(filter, page, 10);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setPage((prev) => prev + 1);
      setHasMore(result.data.pagination.hasNextPage);
      setModules((prev) => [...prev, ...result.data.modules]);
    } catch (err) {
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !error) {
          loadMoreModules();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, isLoading, sentinel, error]);

  return (
    <div>
      <ul className="flex flex-col gap-0 -ml-4 w-[calc(100%+2rem)]">
        {modules.map((m, idx) => (
          <li className="not-first:-mt-px" key={`module-view-${idx}`}>
            {renderItem(m)}
          </li>
        ))}
      </ul>

      <div className="mt-5">
        {(() => {
          if (error) {
            return (
              <div className="flex flex-col gap-2">
                <p className="text-center text-sm text-background-300">
                  {error}
                </p>
                <Button text="Tentar novamente" onClick={loadMoreModules} />
              </div>
            );
          }

          if (isLoading) {
            return <LoadingSpinner />;
          }

          if (!hasMore) {
            return (
              <p className="text-center text-sm text-background-300">
                {modulesListEndMessage}
              </p>
            );
          }
        })()}
      </div>
      <div className="h-px" ref={setSentinel}></div>
    </div>
  );
}
