"use client";
import { useState } from "react";

export default function PhotoInvite({ recipeId }: { recipeId: number }) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setState("sending");
    try {
      const res = await fetch("/api/photos", { method: "POST", body: new FormData(e.currentTarget) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "Das hat leider nicht geklappt.");
        setState("idle");
        return;
      }
      setState("done");
    } catch {
      setError("Das hat leider nicht geklappt. Bitte versuche es später noch einmal.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <aside className="photo-invite" aria-live="polite">
        <strong>Danke für dein Foto!</strong>
        <p>Wir schauen es uns an und zeigen es hier, sobald es freigegeben ist.</p>
      </aside>
    );
  }

  return (
    <aside className="photo-invite" aria-label="Dein Foto">
      <strong>Hast du das Rezept nachgekocht?</strong>
      <p>Teile dein Foto mit uns und schreib gern ein paar Worte dazu. Wir zeigen es nach kurzer Prüfung hier unter dem Rezept.</p>
      <form onSubmit={onSubmit} className="photo-form">
        <input type="hidden" name="recipeId" value={recipeId} />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="photo-hp" />
        <label>
          Dein Foto (JPG, PNG oder WebP, max. 5 MB)
          <input type="file" name="file" accept="image/jpeg,image/png,image/webp" required />
        </label>
        <label>
          Dein Name (optional)
          <input type="text" name="name" maxLength={40} placeholder="z. B. Anna" />
        </label>
        <label>
          Dein Kommentar (optional)
          <textarea name="comment" maxLength={500} rows={3} placeholder="Wie ist es dir gelungen?" />
        </label>
        <label className="photo-consent">
          <input type="checkbox" name="consent" value="yes" required />
          <span>Ich habe das Foto selbst gemacht und bin mit der Veröffentlichung auf GoldeneRezepte einverstanden. Ich kann die Entfernung jederzeit per E-Mail verlangen.</span>
        </label>
        {error && <p className="photo-error" role="alert">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={state === "sending"}>
          {state === "sending" ? "Wird gesendet …" : "Foto senden"}
        </button>
      </form>
    </aside>
  );
}
