"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} aria-label="TravelTrucks home">
          <img
            src="/TravelTrucks.svg"
            alt="TravelTrucks"
            className={styles.logoImage}
          />
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <Link
            href="/"
            className={`${styles.navLink} ${
              pathname === "/" ? styles.active : ""
            }`}
          >
            Home
          </Link>

          <Link
            href="/catalog"
            className={`${styles.navLink} ${
              pathname.startsWith("/catalog") ? styles.active : ""
            }`}
          >
            Catalog
          </Link>
        </nav>
      </div>
    </header>
  );
}
