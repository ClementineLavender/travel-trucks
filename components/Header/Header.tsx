import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} aria-label="TravelTrucks home">
          <span>Travel</span>
          <span className={styles.logoMuted}>Trucks</span>
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <Link href="/" className={styles.navLink}>
            Home
          </Link>

          <Link href="/catalog" className={styles.navLink}>
            Catalog
          </Link>
        </nav>
      </div>
    </header>
  );
}
