import { FaStar } from "react-icons/fa";
import styles from "./Rating.module.css";

export default function Rating({
  value,
  count,
  variant = "summary",
}: {
  value: number;
  count?: number;
  variant?: "summary" | "stars";
}) {
  if (variant === "stars") {
    const clamped = Math.max(0, Math.min(5, value));
    return (
      <span className={styles.starsRoot} aria-label={`${value} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = Math.max(0, Math.min(1, clamped - star + 1));
          return (
            <span className={styles.star} key={star} aria-hidden="true">
              <FaStar />
              <span
                className={styles.starFill}
                style={{ width: `${fill * 100}%` }}
              >
                <FaStar />
              </span>
            </span>
          );
        })}
      </span>
    );
  }
  return (
    <span
      className={styles.root}
      aria-label={`${value} out of 5 stars${count ? `, ${count} reviews` : ""}`}
    >
      <FaStar className={styles.summaryStar} aria-hidden="true" />
      <span>{value.toFixed(1)}</span>
      {count !== undefined && <span>({count} Reviews)</span>}
    </span>
  );
}
