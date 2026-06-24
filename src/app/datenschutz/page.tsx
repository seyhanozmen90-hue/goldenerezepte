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

          <h2>3. Google Analytics</h2>
          <p>
            Diese Website verwendet Google Analytics 4, einen Webanalysedienst der Google Ireland Limited,
            Gordon House, Barrow Street, Dublin 4, Irland. Google Analytics verwendet Cookies und ähnliche
            Technologien, um die Nutzung der Website zu analysieren. Die dadurch erzeugten Informationen
            werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert.
          </p>
          <p>
            Die Nutzung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse
            an der Analyse und Verbesserung unseres Angebots). Sie können der Datenerfassung durch
            Google Analytics widersprechen, indem Sie ein Browser-Plugin installieren:
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)", marginLeft: "0.25rem" }}>
              Google Analytics Opt-out
            </a>.
          </p>

          <h2>4. Cookies</h2>
          <p>
            Diese Website verwendet technisch notwendige Session-Cookies für den Adminbereich sowie
            Cookies von Google Analytics zur Websiteanalyse (siehe Abschnitt 3).
          </p>

          <h2>5. Ihre Rechte</h2>
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

          <h2>6. Beschwerderecht</h2>
          <p>
            Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren. Die
            zuständige Aufsichtsbehörde richtet sich nach Ihrem Bundesland.
          </p>

          <h2>7. Aktualität dieser Datenschutzerklärung</h2>
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
