import styles from "./CatalogLoading.module.css";

export default function CatalogLoading() {
  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <div className={styles.dialog}>
        <span className={styles.spinner} aria-hidden="true" />
        <h2>Loading tracks...</h2>
        <p>
          Please wait while we fetch the best
          <br />
          travel trucks for you
        </p>
      </div>
    </div>
  );
}
