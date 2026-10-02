import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Kontakt – GoldeneRezepte",
  description: "Fragen zu einem Rezept, Anregungen oder Kooperationsanfragen? So erreichst du Seyhan von GoldeneRezepte.",
  alternates: { canonical: "https://goldene-rezepte.com/kontakt" },
};

export default function Kontakt() {
  return (
    <>
      <NavBar />

      <div className="container section" style={{ maxWidth: "700px" }}>
        <h1 className="section-title">Kontakt</h1>
        <div className="legal-body">
          <p>
            Du hast ein Rezept nachgekocht und eine Frage dazu? Ist dir ein Fehler aufgefallen,
            oder hast du einen Wunsch für ein neues Rezept? Dann schreib mir gern – ich freue mich
            über jede Nachricht.
          </p>

          <h2>E-Mail</h2>
          <p>
            <a href="mailto:goldene.rezepte@gmail.com" style={{ color: "var(--gold)" }}>
              goldene.rezepte@gmail.com
            </a>
          </p>
          <p>Ich antworte in der Regel innerhalb weniger Tage.</p>

          <h2>Facebook</h2>
          <p>
            Neue Rezepte teile ich auch auf{" "}
            <a
              href="https://www.facebook.com/profile.php?id=61588997481232"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--gold)" }}
            >
              unserer Facebook-Seite
            </a>
            .
          </p>

          <h2>Anschrift</h2>
          <p>
            Die vollständige Anschrift findest du im <Link href="/impressum" style={{ color: "var(--gold)" }}>Impressum</Link>.
          </p>

          <p style={{ marginTop: "2rem" }}>
            Viele Grüße
            <br />
            <em style={{ color: "var(--gold)" }}>Seyhan</em>
          </p>
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
              <li><Link href="/kontakt">Kontakt</Link></li>
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
