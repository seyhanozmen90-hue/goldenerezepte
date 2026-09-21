"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = "cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "granted" && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
    }
    if (!stored) setVisible(true);
  }, []);

  const respond = (granted: boolean) => {
    localStorage.setItem(STORAGE_KEY, granted ? "granted" : "denied");
    if (granted && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-Einwilligung"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "var(--card)",
        borderTop: "1px solid var(--border)",
        padding: "1.25rem",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
      }}
    >
      <p
        style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: "0.88rem",
          color: "var(--muted)",
          maxWidth: "560px",
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        Wir verwenden Cookies, um die Nutzung unserer Website zu analysieren und dir Inhalte
        anzuzeigen. Mehr dazu in unserer{" "}
        <Link href="/datenschutz" style={{ color: "var(--gold)" }}>
          Datenschutzerklärung
        </Link>
        .
      </p>
      <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
        <button onClick={() => respond(false)} className="btn btn-outline" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}>
          Ablehnen
        </button>
        <button onClick={() => respond(true)} className="btn btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}>
          Akzeptieren
        </button>
      </div>
    </div>
  );
}
