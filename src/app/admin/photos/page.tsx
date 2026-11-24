"use client";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Photo = {
  id: number;
  name: string | null;
  comment: string | null;
  url: string;
  status: string;
  createdAt: string;
  recipe: { id: number; title: string; slug: string } | null;
};

export default function AdminPhotos() {
  const { status } = useSession();
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/photos");
    if (res.ok) setPhotos(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin");
    if (status === "authenticated") load();
  }, [status, router, load]);

  async function approve(id: number, next: "approved" | "pending") {
    await fetch("/api/admin/photos", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: next }) });
    load();
  }

  async function remove(id: number) {
    if (!confirm("Fotoğraf kalıcı olarak silinsin mi? (Delete this photo permanently?)")) return;
    await fetch("/api/admin/photos", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  }

  const pending = photos.filter((p) => p.status === "pending");
  const approved = photos.filter((p) => p.status === "approved");

  const Card = ({ p }: { p: Photo }) => (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <a href={p.url} target="_blank" rel="noopener noreferrer"><img src={p.url} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} /></a>
      <div style={{ padding: "0.8rem", fontFamily: "system-ui, sans-serif", fontSize: "0.9rem" }}>
        <div style={{ color: "var(--gold)", marginBottom: 4 }}>
          {p.recipe ? <Link href={`/rezepte/${p.recipe.slug}`} target="_blank" style={{ color: "var(--gold)" }}>{p.recipe.title}</Link> : "Tarif bulunamadı"}
        </div>
        <div style={{ color: "var(--muted)" }}>İsim: {p.name ?? "—"}</div>
        {p.comment && <div style={{ color: "var(--text)", margin: "6px 0" }}>“{p.comment}”</div>}
        <div style={{ color: "var(--muted2)", fontSize: "0.8rem" }}>{new Date(p.createdAt).toLocaleString("de-DE")}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          {p.status === "pending"
            ? <button className="btn btn-primary" onClick={() => approve(p.id, "approved")}>✓ Onayla</button>
            : <button className="btn btn-outline" onClick={() => approve(p.id, "pending")}>Yayından kaldır</button>}
          <button className="btn btn-outline" onClick={() => remove(p.id)}>🗑 Sil</button>
        </div>
      </div>
    </div>
  );

  const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" } as const;

  return (
    <div className="container section">
      <p><Link href="/admin/dashboard" style={{ color: "var(--gold)" }}>← Dashboard</Link></p>
      <h1 className="section-title">Okur fotoğrafları (Leserfotos)</h1>
      {loading ? <p>Yükleniyor…</p> : (
        <>
          <h2 style={{ margin: "1.5rem 0 1rem" }}>Onay bekleyen ({pending.length})</h2>
          {pending.length === 0 ? <p style={{ color: "var(--muted)" }}>Bekleyen fotoğraf yok.</p> : <div style={grid}>{pending.map((p) => <Card key={p.id} p={p} />)}</div>}
          <h2 style={{ margin: "2rem 0 1rem" }}>Yayında ({approved.length})</h2>
          {approved.length === 0 ? <p style={{ color: "var(--muted)" }}>Henüz yok.</p> : <div style={grid}>{approved.map((p) => <Card key={p.id} p={p} />)}</div>}
        </>
      )}
    </div>
  );
}
