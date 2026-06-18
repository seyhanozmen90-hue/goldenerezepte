"use client";
import { useState } from "react";
import Link from "next/link";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav>
      <Link href="/" className="nav-logo" onClick={close}>
        Goldene<span>Rezepte</span>
      </Link>

      <div className={`nav-links${open ? " nav-open" : ""}`}>
        <Link href="/" onClick={close}>Startseite</Link>
        <Link href="/rezepte" onClick={close}>Alle Rezepte</Link>
        <Link href="/ueber-uns" onClick={close}>Über uns</Link>
        <Link href="/impressum" onClick={close}>Impressum</Link>
      </div>

      <button
        className={`nav-hamburger${open ? " nav-hamburger-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Menü öffnen"
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
}
