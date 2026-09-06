"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header/Header";
import Filters from "@/components/Filters/Filters";
import CamperList from "@/components/CamperList/CamperList";
import CatalogLoading from "@/components/CatalogLoading/CatalogLoading";
import { getCampers } from "@/lib/api";
import type { CamperFilters } from "@/types/camper";
import styles from "./catalog.module.css";

const PAGE_SIZE = 4;

export default function CatalogPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<CamperFilters>(
    () => ({
      location: searchParams.get("location") ?? "",
      form: searchParams.get("form") ?? "",
      engine: searchParams.get("engine") ?? "",
      transmission: searchParams.get("transmission") ?? "",
    }),
    [searchParams],
  );

  const query = useInfiniteQuery({
    queryKey: ["campers", filters],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getCampers(pageParam, PAGE_SIZE, filters),
    getNextPageParam: (lastPage, allPages) => {
      if (
        lastPage.totalPages !== undefined &&
        allPages.length >= lastPage.totalPages
      )
        return undefined;
      if (
        lastPage.total !== undefined &&
        allPages.flatMap((page) => page.campers).length >= lastPage.total
      )
        return undefined;
      if (lastPage.campers.length < PAGE_SIZE) return undefined;
      return allPages.length + 1;
    },
  });

  const allCampers = query.data?.pages.flatMap((page) => page.campers) ?? [];

  const visibleCount = query.data ? query.data.pages.length * PAGE_SIZE : 0;

  const campers = allCampers.slice(0, visibleCount);

  const hasMore =
    query.hasNextPage &&
    campers.length < (query.data?.pages[0]?.total ?? Infinity);

  const applyFilters = (next: CamperFilters) => {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(
      `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
    );
  };

  return (
    <>
      <Header />
      <main className="container">
        <div className={styles.layout}>
          <Filters
            key={JSON.stringify(filters)}
            initial={filters}
            onApply={applyFilters}
          />
          <section className={styles.results} aria-labelledby="catalog-title">
            <h1 id="catalog-title" className="visually-hidden">
              Camper catalog
            </h1>
            {query.isPending ? (
              <CatalogLoading />
            ) : query.isError ? (
              <div className={styles.error}>
                <h2>We couldn&apos;t load the campers</h2>
                <p>Please try again.</p>
                <button type="button" onClick={() => query.refetch()}>
                  Try again
                </button>
              </div>
            ) : (
              <CamperList
                campers={campers}
                loadingMore={query.isFetchingNextPage}
                hasMore={Boolean(hasMore)}
                onLoadMore={() => query.fetchNextPage()}
                onClearFilters={() => router.push(pathname)}
              />
            )}
          </section>
        </div>
      </main>
    </>
  );
}
