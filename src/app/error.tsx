"use client";
import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", fontFamily: "system-ui, sans-serif", padding: "2rem", textAlign: "center" }}>
      <div style={{ fontSize: "4rem" }}>🍽️</div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Etwas ist schiefgelaufen</h1>
      <p style={{ color: "var(--muted)", maxWidth: "400px" }}>Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.</p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button onClick={reset} className="btn btn-primary">Erneut versuchen</button>
        <Link href="/" className="btn btn-outline">Zur Startseite</Link>
      </div>
    </div>
  );
}
