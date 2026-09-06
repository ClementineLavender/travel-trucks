import Link from "next/link";
import Header from "@/components/Header/Header";
import styles from "./home.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.hero}>
        <div className={styles.overlay} />
        <div className={styles.content}>
          <h1>Campers of your dreams</h1>
          <p>You can find everything you want in our catalog</p>
          <Link href="/catalog" className={styles.cta}>
            View Now
          </Link>
        </div>
      </main>
    </div>
  );
}
