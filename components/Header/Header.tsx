import Link from "next/link";

export default function Header() {
  return (
    <header>
      <div>
        <Link href="/">TravelTrucks</Link>

        <nav>
          <Link href="/">Home</Link>
          <Link href="/catalog">Catalog</Link>
        </nav>
      </div>
    </header>
  );
}