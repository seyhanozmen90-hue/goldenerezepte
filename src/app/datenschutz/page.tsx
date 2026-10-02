import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Datenschutz – GoldeneRezepte",
  description: "Datenschutzerklärung von GoldeneRezepte.",
};

const linkStyle = { color: "var(--gold)" };

export default function Datenschutz() {
  return (
    <>
      <NavBar />
      <div className="container section" style={{ maxWidth: "760px" }}>
        <h1 className="section-title">Datenschutzerklärung</h1>

        <div className="legal-body">
          <h2>1. Verantwortliche Person</h2>
          <p>
            Seyhan Özmen<br />
            1847/3 Sokak No:26, Kat:3<br />
            Karşıyaka, Izmir, Türkei<br />
            E-Mail: goldene.rezepte@gmail.com
          </p>

          <h2>2. Hosting</h2>
          <p>
            Diese Website wird bei der Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA,
            gehostet. Beim Aufruf der Website verarbeitet Vercel technisch notwendige Daten wie deine
            IP-Adresse, um die Seiten auszuliefern. Die Rezeptbilder und Rezeptdaten werden bei der
            Supabase Inc. (USA) gespeichert und über Vercel ausgeliefert. Rechtsgrundlage ist unser
            berechtigtes Interesse an einem sicheren und zuverlässigen Betrieb der Website (Art. 6
            Abs. 1 lit. f DSGVO). Für Übermittlungen in die USA stützen sich die Anbieter auf das
            EU-US Data Privacy Framework bzw. EU-Standardvertragsklauseln.
          </p>

          <h2>3. Server-Log-Dateien</h2>
          <p>
            Beim Besuch der Website werden automatisch Informationen in sogenannten Server-Log-Dateien
            gespeichert, die dein Browser übermittelt:
          </p>
          <ul>
            <li>Browsertyp und -version</li>
            <li>verwendetes Betriebssystem</li>
            <li>Referrer-URL</li>
            <li>IP-Adresse bzw. Hostname des zugreifenden Rechners</li>
            <li>Uhrzeit der Serveranfrage</li>
          </ul>
          <p>
            Diese Daten werden nicht mit anderen Datenquellen zusammengeführt und nur für den Betrieb
            und die Sicherheit der Website verwendet (Art. 6 Abs. 1 lit. f DSGVO).
          </p>

          <h2>4. Einwilligung in Cookies</h2>
          <p>
            Wenn du die Website aus dem Europäischen Wirtschaftsraum, dem Vereinigten Königreich oder der
            Schweiz besuchst, wirst du beim ersten Besuch über die Einwilligungsabfrage von Google (eine
            von Google zertifizierte Consent-Management-Plattform) um deine Einwilligung in Analyse- und
            Werbe-Cookies gebeten. Solange du nicht eingewilligt hast, laufen Google Analytics und Google
            AdSense in einem eingeschränkten Modus ohne Analyse- oder Werbe-Cookies und ohne
            personalisierte Werbung.
          </p>
          <p>
            Du kannst deine Auswahl jederzeit ändern oder widerrufen, indem du die Cookies dieser Website
            in deinem Browser löschst – beim nächsten Besuch wird die Abfrage erneut angezeigt.
          </p>

          <h2>5. Google Analytics</h2>
          <p>
            Diese Website verwendet Google Analytics 4, einen Webanalysedienst der Google Ireland Limited,
            Gordon House, Barrow Street, Dublin 4, Irland. Google Analytics verwendet Cookies und ähnliche
            Technologien, um die Nutzung der Website auszuwerten. Die erzeugten Informationen können an
            Server von Google in den USA übertragen werden.
          </p>
          <p>
            Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die du jederzeit
            widerrufen kannst (siehe Abschnitt 4). Zusätzlich kannst du die Erfassung mit dem{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Browser-Add-on zur Deaktivierung von Google Analytics
            </a>{" "}
            verhindern.
          </p>

          <h2>6. Google AdSense</h2>
          <p>
            Diese Website nutzt Google AdSense, einen Werbedienst der Google Ireland Limited, Gordon House,
            Barrow Street, Dublin 4, Irland. Google AdSense verwendet Cookies und ähnliche Technologien, um
            Anzeigen einzublenden – mit deiner Einwilligung auch personalisiert auf Grundlage deiner
            früheren Besuche auf dieser und anderen Websites.
          </p>
          <p>
            Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Personalisierte Werbung
            kannst du außerdem in den{" "}
            <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Werbeeinstellungen von Google
            </a>{" "}
            deaktivieren. Weitere Informationen findest du unter{" "}
            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              policies.google.com/technologies/ads
            </a>.
          </p>

          <h2>7. Link zu Facebook</h2>
          <p>
            Auf dieser Website befindet sich ein einfacher Link zu meiner Facebook-Seite. Es werden keine
            Facebook-Plugins eingebunden; Daten werden erst an Meta Platforms Ireland Ltd. übertragen, wenn
            du den Link anklickst und Facebook besuchst.
          </p>

          <h2>8. Kontakt per E-Mail</h2>
          <p>
            Wenn du mir eine E-Mail schreibst, verwende ich deine Angaben ausschließlich, um deine Anfrage
            zu beantworten (Art. 6 Abs. 1 lit. f DSGVO). Die Nachricht wird gelöscht, sobald sie nicht mehr
            benötigt wird.
          </p>

          <h2>9. Cookies</h2>
          <p>
            Diese Website verwendet technisch notwendige Session-Cookies für den Adminbereich sowie, nach
            deiner Einwilligung, Cookies von Google Analytics und Google AdSense (siehe Abschnitte 4–6).
          </p>

          <h2>10. Deine Rechte</h2>
          <p>Du hast jederzeit das Recht auf:</p>
          <ul>
            <li>Auskunft über deine gespeicherten Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>Löschung deiner Daten (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
            <li>Widerruf einer erteilten Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
          </ul>
          <p>
            Schreib mir dazu einfach eine E-Mail an goldene.rezepte@gmail.com.
          </p>

          <h2>11. Beschwerderecht</h2>
          <p>
            Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren, insbesondere in
            dem Land bzw. Bundesland deines Wohnsitzes.
          </p>

          <h2>12. Aktualität dieser Datenschutzerklärung</h2>
          <p>Stand: Oktober 2026</p>
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
