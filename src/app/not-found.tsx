import Link from "next/link";
import NavBar from "@/components/NavBar";

export default function NotFound() {
  return (
    <>
      <NavBar />
      <div
        style={{
          minHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "4rem 2rem",
        }}
      >
        <div style={{ fontSize: "5rem", marginBottom: "1.5rem" }}>🍽️</div>
        <h1
          style={{
            fontSize: "clamp(3rem, 10vw, 6rem)",
            fontWeight: 700,
            color: "var(--gold)",
            lineHeight: 1,
            marginBottom: "0.5rem",
          }}
        >
          404
        </h1>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text)" }}>
          Seite nicht gefunden
        </h2>
        <p
          style={{
            fontFamily: "system-ui, sans-serif",
            color: "var(--muted)",
            maxWidth: "420px",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
          }}
        >
          Diese Seite existiert leider nicht. Vielleicht findest du in unserer Rezeptsammlung
          etwas Leckeres?
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/" className="btn btn-primary">Zur Startseite</Link>
          <Link href="/rezepte" className="btn btn-outline">Alle Rezepte</Link>
        </div>
      </div>

      <footer>
        <div className="footer-bottom" style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          © {new Date().getFullYear()} GoldeneRezepte
        </div>
      </footer>
    </>
  );
}
