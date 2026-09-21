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
            Seyhan Özmen<br />
            1847/3 Sokak No:26, Kat:3<br />
            Karşıyaka, Izmir, Türkei<br />
            E-Mail: goldene.rezepte@gmail.com
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

          <h2>3. Einwilligung (Cookie-Banner)</h2>
          <p>
            Beim ersten Besuch unserer Website wirst du über ein Cookie-Banner um deine Einwilligung
            zur Verwendung von Analyse- und Werbe-Cookies gebeten. Solange keine Einwilligung erteilt
            wurde, werden Google Analytics und etwaige Werbedienste im eingeschränkten Modus betrieben
            (kein Setzen von Analyse- oder Werbe-Cookies, keine Personalisierung). Du kannst deine
            Einwilligung jederzeit widerrufen, indem du die Cookies deines Browsers für diese Website
            löschst und die Seite neu lädst.
          </p>

          <h2>4. Google Analytics</h2>
          <p>
            Diese Website verwendet Google Analytics 4, einen Webanalysedienst der Google Ireland Limited,
            Gordon House, Barrow Street, Dublin 4, Irland. Google Analytics verwendet Cookies und ähnliche
            Technologien, um die Nutzung der Website zu analysieren. Die dadurch erzeugten Informationen
            werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert.
          </p>
          <p>
            Die Nutzung erfolgt auf Grundlage deiner Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die du
            über das Cookie-Banner erteilst. Du kannst deine Einwilligung jederzeit widerrufen. Zusätzlich
            kannst du der Datenerfassung durch Google Analytics widersprechen, indem du ein Browser-Plugin
            installierst:
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)", marginLeft: "0.25rem" }}>
              Google Analytics Opt-out
            </a>.
          </p>

          <h2>5. Google AdSense (Werbung)</h2>
          <p>
            Diese Website nutzt bzw. plant die Nutzung von Google AdSense, einem Werbedienst der
            Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Google AdSense
            verwendet Cookies und ähnliche Technologien, um Anzeigen auf Grundlage früherer Besuche
            auf dieser oder anderen Websites zu schalten. Die Nutzung dieser Cookies ermöglicht es
            Google und seinen Partnern, dir Anzeigen auf Basis deines Besuchs dieser und/oder anderer
            Websites im Internet zu präsentieren.
          </p>
          <p>
            Die Nutzung erfolgt ausschließlich auf Grundlage deiner Einwilligung (Art. 6 Abs. 1 lit. a
            DSGVO) über das Cookie-Banner. Du kannst die personalisierte Werbung deaktivieren, indem du
            die Website{" "}
            <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)" }}>
              Werbeeinstellungen von Google
            </a>{" "}
            besuchst. Weitere Informationen zur Verwendung von Daten durch Google findest du unter{" "}
            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)" }}>
              policies.google.com/technologies/ads
            </a>.
          </p>

          <h2>6. Cookies</h2>
          <p>
            Diese Website verwendet technisch notwendige Session-Cookies für den Adminbereich sowie,
            nach erteilter Einwilligung, Cookies von Google Analytics und Google AdSense (siehe
            Abschnitt 3–5).
          </p>

          <h2>7. Ihre Rechte</h2>
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
            goldene.rezepte@gmail.com
          </p>

          <h2>8. Beschwerderecht</h2>
          <p>
            Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren. Die
            zuständige Aufsichtsbehörde richtet sich nach Ihrem Bundesland.
          </p>

          <h2>9. Aktualität dieser Datenschutzerklärung</h2>
          <p>Stand: September 2026</p>
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
