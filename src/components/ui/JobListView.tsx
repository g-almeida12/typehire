"use client";

import { JobResponsePayload } from "@/lib/schemas";
import { useEffect, useRef, useState } from "react";
import { getJobsAction } from "@/lib/actions";
import { Button } from "../common/Button";
import { JobCard } from "../common/JobCard";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface JobListViewProps {
  initialJobs: JobResponsePayload[];
  initialHasMore: boolean;
}

export function JobListView({ initialJobs, initialHasMore }: JobListViewProps) {
  const [jobs, setJobs] = useState<JobResponsePayload[]>(initialJobs);
  const [page, setPage] = useState<number>(2);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMoreJobs = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const result = await getJobsAction(page, 10);

    if (result.success) {
      setPage((prev) => prev + 1);
      setHasMore(result.data.pagination.hasNextPage);
      setJobs((prev) => [...prev, ...result.data.jobs]);
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!observerTarget.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading && !error) {
        loadMoreJobs();
      }
    });

    observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  return (
    <div>
      <div className="flex flex-col gap-0 -ml-4 w-[calc(100%+2rem)]">
        {jobs.map((j) => (
          <JobCard {...j} id={j.id} key={j.id} />
        ))}
      </div>

      <div className="mt-5">
        {(() => {
          if (error) {
            return (
              <div className="flex flex-col gap-2">
                <p className="text-center text-sm text-background-300">
                  Não foi possível carregar mais vagas.
                </p>
                <Button text="Tentar novamente" onClick={loadMoreJobs} />
              </div>
            );
          }

          if (isLoading) {
            return <LoadingSpinner />;
          }

          if (!hasMore) {
            return (
              <p className="text-center text-sm text-background-300">
                Infelizmente não temos mais vagas para mostrar.
              </p>
            );
          }
        })()}
      </div>
      <div ref={observerTarget}></div>
    </div>
  );
}
