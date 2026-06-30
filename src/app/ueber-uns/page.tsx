import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Über uns – GoldeneRezepte",
  description: "Erfahre mehr über GoldeneRezepte – Goldene Rezepte für jeden Tag.",
};

export default function UeberUns() {
  return (
    <>
      <NavBar />

      {/* Hero */}
      <div
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.9) 100%), url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600') center/cover no-repeat",
          padding: "6rem 2rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>
          Über <em style={{ color: "var(--gold)", fontStyle: "italic" }}>GoldeneRezepte</em>
        </h1>
        <p style={{ color: "#c8bfb0", fontFamily: "system-ui, sans-serif", maxWidth: "560px", margin: "0 auto", fontSize: "1.1rem", lineHeight: 1.7 }}>
          Goldene Rezepte für jeden Tag – von Generation zu Generation weitergegeben.
        </p>
      </div>

      <div className="container section" style={{ maxWidth: "820px" }}>
        {/* Mission */}
        <div style={{ marginBottom: "4rem" }}>
          <h2 className="section-title">Unsere Mission</h2>
          <p style={{ fontFamily: "system-ui, sans-serif", color: "var(--muted)", lineHeight: 1.85, marginTop: "1.5rem", fontSize: "1rem" }}>
            GoldeneRezepte entstand aus einer einfachen Idee: die besten Rezepte der deutschen
            Küche an einem Ort zu sammeln und für alle zugänglich zu machen. Von herzhaften
            Hausmannsgerichten bis zu feinen Backwaren – wir bewahren das kulinarische Erbe
            Deutschlands und machen es alltagstauglich.
          </p>
          <p style={{ fontFamily: "system-ui, sans-serif", color: "var(--muted)", lineHeight: 1.85, marginTop: "1rem", fontSize: "1rem" }}>
            Jedes Rezept wird sorgfältig zusammengestellt, getestet und mit genauen Angaben
            versehen – damit es in jeder Küche gelingt, egal ob man Anfänger oder erfahrener
            Hobbykoch ist.
          </p>
        </div>

        {/* Werte */}
        <h2 className="section-title" style={{ marginBottom: "2rem" }}>Unsere Werte</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
            gap: "1.5rem",
            marginBottom: "4rem",
          }}
        >
          {[
            { icon: "🏡", title: "Authentizität", text: "Rezepte so, wie sie in deutschen Haushalten wirklich gekocht werden." },
            { icon: "📖", title: "Einfachheit", text: "Klare Anleitungen, verständliche Zutaten – für jeden nachkochbar." },
            { icon: "🌿", title: "Qualität", text: "Jedes Rezept wird sorgfältig geprüft, bevor es veröffentlicht wird." },
            { icon: "❤️", title: "Leidenschaft", text: "Kochen ist mehr als Nahrung – es ist Kultur, Familie und Freude." },
          ].map(({ icon, title, text }) => (
            <div
              key={title}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "1.75rem 1.5rem",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem", color: "var(--text)" }}>{title}</div>
              <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6 }}>{text}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/rezepte" className="btn btn-primary">Rezepte entdecken</Link>
        </div>
      </div>

      <footer>
        <div className="footer-grid" style={{ maxWidth: "1200px", margin: "0 auto 3rem" }}>
          <div>
            <div className="footer-logo">GoldeneRezepte</div>
            <p className="footer-desc">Goldene Rezepte für jeden Tag.</p>
          </div>
          <div>
            <div className="footer-title">Info</div>
            <ul className="footer-links">
              <li><Link href="/ueber-uns">Über uns</Link></li>
              <li><Link href="/impressum">Impressum</Link></li>
              <li><Link href="/datenschutz">Datenschutz</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom" style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          © {new Date().getFullYear()} GoldeneRezepte
        </div>
      </footer>
    </>
  );
}
