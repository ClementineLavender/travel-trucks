"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      className="container"
      style={{ padding: "120px 0", textAlign: "center" }}
    >
      <h1>Something went wrong</h1>
      <p style={{ color: "#475467" }}>
        We couldn&apos;t load this camper right now.
      </p>
      <button
        type="button"
        onClick={reset}
        style={{
          height: 48,
          padding: "0 24px",
          border: 0,
          borderRadius: 999,
          background: "#e44848",
          color: "#fff",
          fontWeight: 700,
        }}
      >
        Try again
      </button>
    </main>
  );
}
