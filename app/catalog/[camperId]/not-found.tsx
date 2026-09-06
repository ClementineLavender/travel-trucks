import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="container"
      style={{ padding: "120px 0", textAlign: "center" }}
    >
      <h1>Camper not found</h1>
      <p>The camper you are looking for does not exist.</p>
      <Link href="/catalog" style={{ color: "#e44848", fontWeight: 700 }}>
        Back to catalog
      </Link>
    </main>
  );
}
