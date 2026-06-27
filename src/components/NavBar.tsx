"use client";
import { useState } from "react";
import Link from "next/link";

const FbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.883v2.258h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav>
      <Link href="/" className="nav-logo" onClick={close}>
        Goldene<span>Rezepte</span>
      </Link>

      <div className="fb-nav-buttons">
        <a
          href="https://www.facebook.com/profile.php?id=61588997481232"
          target="_blank"
          rel="noopener noreferrer"
          className="fb-nav-link"
          aria-label="Facebook Sayfamız"
        >
          <FbIcon />
          <span className="fb-nav-label">Sayfamız</span>
        </a>
        <a
          href="https://www.facebook.com/groups/27090573917251428"
          target="_blank"
          rel="noopener noreferrer"
          className="fb-nav-link"
          aria-label="Facebook Topluluğumuz"
        >
          <FbIcon />
          <span className="fb-nav-label">Topluluğumuz</span>
        </a>
      </div>

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
