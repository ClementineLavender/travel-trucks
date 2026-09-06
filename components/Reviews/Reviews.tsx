import Rating from "@/components/Rating/Rating";
import type { Review } from "@/types/camper";
import styles from "./Reviews.module.css";

export default function Reviews({
  reviews,
  totalReviews = 0,
}: {
  reviews: Review[];
  totalReviews?: number;
}) {
  if (!reviews.length) {
    return (
      <p className={styles.empty}>
        {totalReviews > 0
          ? `Review details are not available for this camper.`
          : "No reviews yet."}
      </p>
    );
  }
  return (
    <div className={styles.list}>
      {reviews.map((review, index) => (
        <article
          className={styles.item}
          key={`${review.reviewer_name}-${index}`}
        >
          <div className={styles.header}>
            <div className={styles.avatar}>
              {review.reviewer_name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className={styles.reviewer}>
              <h3>{review.reviewer_name}</h3>
              <Rating value={review.reviewer_rating} variant="stars" />
            </div>
          </div>
          <p>{review.comment}</p>
        </article>
      ))}
    </div>
  );
}
