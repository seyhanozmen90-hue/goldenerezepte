import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Datenschutz – GoldeneRezepte",
  description: "Datenschutzerklärung von GoldeneRezepte.",
};

export default function Datenschutz() {
  return (
    <>
      <NavBar />
      <div className="container section" style={{ maxWidth: "760px" }}>
        <h1 className="section-title">Datenschutzerklärung</h1>

        <div className="legal-body">
          <h2>1. Verantwortlicher</h2>
          <p>
            GoldeneRezepte<br />
            Musterstraße 1, 12345 Musterstadt<br />
            E-Mail: info@goldenerezepte.de
          </p>

          <h2>2. Erhebung und Speicherung personenbezogener Daten</h2>
          <p>
            Beim Besuch unserer Website werden automatisch Informationen in sogenannten
            Server-Log-Dateien gespeichert, die Ihr Browser übermittelt. Dies sind:
          </p>
          <ul>
            <li>Browsertyp und -version</li>
            <li>Verwendetes Betriebssystem</li>
            <li>Referrer-URL</li>
            <li>Hostname des zugreifenden Rechners</li>
            <li>Uhrzeit der Serveranfrage</li>
          </ul>
          <p>
            Diese Daten sind nicht bestimmten Personen zuordenbar und werden nicht mit
            anderen Datenquellen zusammengeführt. Sie werden ausschließlich zur statistischen
            Auswertung und zum Betrieb der Website verwendet.
          </p>

          <h2>3. Cookies</h2>
          <p>
            Diese Website verwendet ausschließlich technisch notwendige Session-Cookies für
            den Adminbereich. Es werden keine Tracking- oder Werbe-Cookies eingesetzt.
          </p>

          <h2>4. Ihre Rechte</h2>
          <p>Sie haben jederzeit das Recht auf:</p>
          <ul>
            <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
          </ul>
          <p>
            Zur Ausübung Ihrer Rechte wenden Sie sich bitte per E-Mail an:
            info@goldenerezepte.de
          </p>

          <h2>5. Beschwerderecht</h2>
          <p>
            Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren. Die
            zuständige Aufsichtsbehörde richtet sich nach Ihrem Bundesland.
          </p>

          <h2>6. Aktualität dieser Datenschutzerklärung</h2>
          <p>Stand: Juni 2026</p>
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
