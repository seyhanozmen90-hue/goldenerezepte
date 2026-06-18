import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Impressum – GoldeneRezepte",
  description: "Impressum und rechtliche Angaben von GoldeneRezepte.",
};

export default function Impressum() {
  return (
    <>
      <NavBar />

      <div className="container section" style={{ maxWidth: "700px" }}>
        <h1 className="section-title">Impressum</h1>
        <div className="legal-body">
          <h2>Angaben gemäß § 5 TMG</h2>
          <p>
            <strong style={{ color: "var(--text)" }}>GoldeneRezepte</strong><br />
            Musterstraße 1<br />
            12345 Musterstadt<br />
            Deutschland
          </p>

          <h2>Kontakt</h2>
          <p>E-Mail: info@goldenerezepte.de</p>

          <h2>Verantwortlich für den Inhalt</h2>
          <p>Inhaber GoldeneRezepte (gemäß § 55 Abs. 2 RStV)</p>

          <h2>Haftung für Inhalte</h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen
            Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir
            als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen.
          </p>

          <h2>Urheberrecht</h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
            unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung
            und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
            schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </div>

        <Link href="/" className="btn btn-outline" style={{ marginTop: "2rem" }}>
          ← Zurück zur Startseite
        </Link>
      </div>

      <footer>
        <div className="footer-bottom" style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          © {new Date().getFullYear()} GoldeneRezepte
        </div>
      </footer>
    </>
  );
}
