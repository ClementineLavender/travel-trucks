import Image from "next/image";
import CamperCard from "@/components/CamperCard/CamperCard";
import Loader from "@/components/Loader/Loader";
import type { Camper } from "@/types/camper";
import styles from "./CamperList.module.css";

export default function CamperList({
  campers,
  loadingMore,
  hasMore,
  onLoadMore,
  onClearFilters,
}: {
  campers: Camper[];
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onClearFilters: () => void;
}) {
  if (!campers.length)
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIllustration}>
          <Image
            src="/no-results.png"
            alt=""
            width={530}
            height={410}
            priority
          />
        </div>
        <h2>No campers found</h2>
        <p>
          We couldn&apos;t find any campers that match your filters.
          <br />
          Try adjusting your search or clearing some filters.
        </p>
        <div className={styles.emptyActions}>
          <button
            type="button"
            className={styles.clear}
            onClick={onClearFilters}
          >
            <span aria-hidden="true">×</span>Clear filters
          </button>
          <button
            type="button"
            className={styles.viewAll}
            onClick={onClearFilters}
          >
            View all campers
          </button>
        </div>
      </div>
    );

  return (
    <div className={styles.root}>
      <div className={styles.list}>
        {campers.map((camper) => (
          <CamperCard key={camper.id} camper={camper} />
        ))}
      </div>
      {loadingMore && <Loader label="Loading more campers" />}
      {hasMore && !loadingMore && (
        <button type="button" className={styles.loadMore} onClick={onLoadMore}>
          Load more
        </button>
      )}
    </div>
  );
}
