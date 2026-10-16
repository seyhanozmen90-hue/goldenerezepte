"use client";

type GoogleFC = {
  callbackQueue?: Array<Record<string, () => void>>;
  showRevocationMessage?: () => void;
};

// Öffnet die Einwilligungsabfrage von Google (CMP) erneut, damit Besucher ihre
// Cookie-Auswahl jederzeit ändern oder widerrufen können.
export default function CookieSettingsLink({ style }: { style?: React.CSSProperties }) {
  function openSettings() {
    const w = window as unknown as { googlefc?: GoogleFC };
    w.googlefc = w.googlefc || {};
    w.googlefc.callbackQueue = w.googlefc.callbackQueue || [];
    w.googlefc.callbackQueue.push({
      CONSENT_DATA_READY: () => w.googlefc?.showRevocationMessage?.(),
    });
  }

  return (
    <button
      type="button"
      onClick={openSettings}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        font: "inherit",
        color: "inherit",
        cursor: "pointer",
        textAlign: "left",
        ...style,
      }}
    >
      Cookie-Einstellungen
    </button>
  );
}
