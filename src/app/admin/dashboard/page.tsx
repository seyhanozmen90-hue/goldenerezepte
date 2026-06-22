"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Recipe = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  imageUrl: string | null;
  ingredients: string;
  steps: string;
  published: boolean;
  createdAt: string;
};

const CATEGORIES = ["Hauptgerichte", "Vorspeisen", "Desserts", "Suppen", "Salate", "Backen"];

const CAT_TR: Record<string, string> = {
  "Hauptgerichte": "Ana Yemekler",
  "Vorspeisen": "Başlangıçlar",
  "Desserts": "Tatlılar",
  "Suppen": "Çorbalar",
  "Salate": "Salatalar",
  "Backen": "Fırın",
};

const EMPTY_FORM = {
  title: "", description: "", category: "Backen",
  prepTime: "0", cookTime: "0", servings: "4", difficulty: "Einfach",
  imageUrl: "", ingredients: "", steps: "", published: false,
};

function parseFreeText(raw: string): typeof EMPTY_FORM {
  const lines = raw.split("\n").map((l) => l.trim());
  const title = lines.find((l) => l.length > 0) ?? "";
  const zutatenIdx    = lines.findIndex((l) => /^zutaten$/i.test(l));
  const zubereitungIdx = lines.findIndex((l) => /^zubereitung$/i.test(l));
  let description = "";
  if (zutatenIdx > 0) {
    description = lines.slice(1, zutatenIdx).filter((l) => l.length > 0).join(" ").trim();
  }
  let ingredients = "";
  if (zutatenIdx >= 0 && zubereitungIdx > zutatenIdx) {
    ingredients = lines.slice(zutatenIdx + 1, zubereitungIdx).filter((l) => l.length > 0).join("\n");
  }
  let steps = "";
  if (zubereitungIdx >= 0) {
    steps = lines.slice(zubereitungIdx + 1).filter((l) => l.length > 0 && !/^guten appetit/i.test(l)).join("\n");
  }
  return { ...EMPTY_FORM, title, description, ingredients, steps };
}

function parseTemplateText(raw: string): typeof EMPTY_FORM {
  const get = (key: string) => {
    const m = raw.match(new RegExp(`^${key}\\s*:\\s*(.+)`, "im"));
    return m ? m[1].trim() : "";
  };
  const title       = raw.match(/^#\s+(.+)/m)?.[1]?.trim() ?? "";
  const category    = get("Kategorie") || "Hauptgerichte";
  const prepTime    = get("Hazırlık") || get("Vorbereitung") || "0";
  const cookTime    = get("Pişirme") || get("Kochzeit") || "0";
  const servings    = get("Portiyon") || get("Portionen") || "4";
  const difficulty  = get("Zorluk") || get("Schwierigkeit") || "Einfach";
  const imageUrl    = get("Bild") || get("Görsel") || "";
  const description = get("Açıklama") || get("Beschreibung") || "";
  const ingBlock  = raw.match(/##\s*(?:Malzemeler|Zutaten)\s*\n([\s\S]*?)(?=##|$)/i)?.[1] ?? "";
  const stepBlock = raw.match(/##\s*(?:Adımlar|Yapılış|Zubereitung)\s*\n([\s\S]*?)(?=##|$)/i)?.[1] ?? "";
  const ingredients = ingBlock.split("\n").map((l) => l.replace(/^[-*]\s*/, "").trim()).filter(Boolean).join("\n");
  const steps       = stepBlock.split("\n").map((l) => l.replace(/^\d+[\.\)]\s*/, "").trim()).filter(Boolean).join("\n");
  return { title, description, category, prepTime, cookTime, servings, difficulty, imageUrl, ingredients, steps, published: false };
}

function parseRecipeText(raw: string): typeof EMPTY_FORM {
  return raw.trimStart().startsWith("#") ? parseTemplateText(raw) : parseFreeText(raw);
}

const TEMPLATE = `# Tarif Başlığı
Kategorie: Hauptgerichte
Hazırlık: 15
Pişirme: 30
Portiyon: 4
Zorluk: Einfach
Açıklama: Kısa açıklama.
Bild: https://... (isteğe bağlı)

## Malzemeler
- 500g malzeme
- ...

## Adımlar
1. Birinci adım.
2. İkinci adım.`;

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recipes, setRecipes]       = useState<Recipe[]>([]);
  const [showModal, setShowModal]   = useState(false);
  const [editingId, setEditingId]   = useState<number | null>(null);
  const [mode, setMode]             = useState<"paste" | "manual">("paste");
  const [pasteText, setPasteText]   = useState("");
  const [parseError, setParseError] = useState("");
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [msg, setMsg]               = useState("");
  const [uploading, setUploading]   = useState(false);
  const [filterCat, setFilterCat]   = useState("Alle");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin");
  }, [status, router]);

  useEffect(() => { if (status === "authenticated") loadRecipes(); }, [status]);

  async function loadRecipes() {
    const res = await fetch("/api/rezepte/all");
    if (res.ok) setRecipes(await res.json());
  }

  function openCreate() {
    setEditingId(null); setForm(EMPTY_FORM); setPasteText("");
    setParseError(""); setMsg(""); setMode("paste"); setShowModal(true);
  }

  async function openEdit(recipe: Recipe) {
    setEditingId(recipe.id); setMsg(""); setParseError("");
    let ingredients = ""; let steps = "";
    try { ingredients = JSON.parse(recipe.ingredients).join("\n"); } catch { ingredients = recipe.ingredients; }
    try { steps = JSON.parse(recipe.steps).join("\n"); } catch { steps = recipe.steps; }
    setForm({ title: recipe.title, description: recipe.description, category: recipe.category, prepTime: String(recipe.prepTime), cookTime: String(recipe.cookTime), servings: String(recipe.servings), difficulty: recipe.difficulty, imageUrl: recipe.imageUrl ?? "", ingredients, steps, published: recipe.published });
    setMode("manual"); setShowModal(true);
  }

  function closeModal() {
    setShowModal(false); setEditingId(null); setForm(EMPTY_FORM);
    setPasteText(""); setParseError(""); setMsg("");
  }

  function handleParsePaste() {
    if (!pasteText.trim()) { setParseError("Lütfen tarif metnini yapıştırın."); return; }
    const parsed = parseRecipeText(pasteText);
    if (!parsed.title)       { setParseError("Başlık bulunamadı."); return; }
    if (!parsed.ingredients) { setParseError("Malzemeler bulunamadı. Metinde 'Zutaten' başlığı olmalı."); return; }
    if (!parsed.steps)       { setParseError("Adımlar bulunamadı. Metinde 'Zubereitung' başlığı olmalı."); return; }
    setParseError(""); setForm(parsed); setMode("manual");
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) setForm((f) => ({ ...f, imageUrl: data.url }));
    else setMsg("❌ Görsel yüklenemedi: " + data.error);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg("");
    const body = { ...form, prepTime: 0, cookTime: Number(form.cookTime), servings: 0, difficulty: "", ingredients: JSON.stringify(form.ingredients.split("\n").filter(Boolean)), steps: JSON.stringify(form.steps.split("\n").filter(Boolean)) };
    const url = editingId ? `/api/rezepte/${editingId}` : "/api/rezepte";
    const res = await fetch(url, { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false);
    if (res.ok) { setMsg(editingId ? "✅ Güncellendi!" : "✅ Kaydedildi!"); closeModal(); loadRecipes(); }
    else { const err = await res.json(); setMsg("❌ Hata: " + (err.error || "Bilinmeyen")); }
  }

  async function togglePublish(id: number, published: boolean) {
    await fetch(`/api/rezepte/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !published }) });
    loadRecipes();
  }

  async function deleteRecipe(id: number) {
    if (!confirm("Bu tarifi silmek istediğine emin misin?")) return;
    await fetch(`/api/rezepte/${id}`, { method: "DELETE" });
    loadRecipes();
  }

  if (status === "loading") return <div className="login-page"><div style={{ color: "var(--muted)" }}>Wird geladen... (Yükleniyor...)</div></div>;
  if (status === "unauthenticated") return null;

  const published = recipes.filter((r) => r.published).length;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">🥨 GoldeneRezepte</div>
        <nav className="sidebar-nav">
          <a href="#" className="active">📋 Rezepte (Tarifler)</a>
          <Link href="/">🏠 Zur Website (Siteyi Gör)</Link>
        </nav>
        <div style={{ padding: "1.5rem", marginTop: "auto" }}>
          <button className="btn btn-outline" style={{ width: "100%", fontSize: "0.82rem" }} onClick={() => signOut({ callbackUrl: "/admin" })}>Abmelden (Çıkış Yap)</button>
        </div>
      </aside>

      <main className="dashboard-content">
        <div className="dashboard-title">Dashboard</div>
        <div className="dashboard-subtitle">Willkommen, {session?.user?.name ?? "Admin"} (Hoş geldin)</div>

        <div className="stats-grid">
          <div className="stat-card"><div className="stat-value">{recipes.length}</div><div className="stat-label">Gesamt (Toplam)</div></div>
          <div className="stat-card"><div className="stat-value">{published}</div><div className="stat-label">Veröffentlicht (Yayında)</div></div>
          <div className="stat-card"><div className="stat-value">{recipes.length - published}</div><div className="stat-label">Entwurf (Taslak)</div></div>
        </div>

        {msg && !showModal && (
          <div style={{ marginBottom: "1.5rem", padding: "0.75rem 1rem", borderRadius: "8px", background: "var(--card)", border: "1px solid var(--border)", fontFamily: "system-ui, sans-serif", fontSize: "0.9rem" }}>{msg}</div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Rezepte verwalten (Tarifleri Yönet)</h2>
          <button className="btn btn-primary" style={{ fontSize: "0.85rem", padding: "0.6rem 1.25rem" }} onClick={openCreate}>+ Neues Rezept (Yeni Tarif)</button>
        </div>

        {/* Kategori filtresi */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {[{ de: "Alle", tr: "Hepsi" }, ...CATEGORIES.map((c) => ({ de: c, tr: CAT_TR[c] }))].map(({ de, tr }) => (
            <button
              key={de}
              onClick={() => setFilterCat(de)}
              style={{
                padding: "0.35rem 0.9rem",
                borderRadius: "20px",
                border: "1px solid var(--border)",
                background: filterCat === de ? "var(--gold)" : "var(--card)",
                color: filterCat === de ? "#000" : "var(--muted)",
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.82rem",
                cursor: "pointer",
                fontWeight: filterCat === de ? 700 : 400,
              }}
            >{de} ({tr})</button>
          ))}
        </div>

        {recipes.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📝</div><h3>Noch keine Rezepte (Henüz tarif yok)</h3><p>Klicke auf &quot;Neues Rezept&quot; um zu beginnen.</p></div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead><tr><th>Titel (Başlık)</th><th>Kategorie (Kategori)</th><th>Status (Durum)</th><th>Aktionen (İşlemler)</th></tr></thead>
              <tbody>
                {recipes.filter((r) => filterCat === "Alle" || r.category === filterCat).map((r) => (
                  <tr key={r.id}>
                    <td><Link href={`/rezepte/${r.slug}`} style={{ color: "var(--gold)" }} target="_blank">{r.title}</Link></td>
                    <td><span className="badge badge-gold">{r.category} ({CAT_TR[r.category] ?? r.category})</span></td>
                    <td><span className={`badge ${r.published ? "badge-green" : "badge-red"}`}>{r.published ? "Veröffentlicht (Yayında)" : "Entwurf (Taslak)"}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                        <button className="btn btn-outline" style={{ fontSize: "0.75rem", padding: "0.3rem 0.7rem" }} onClick={() => openEdit(r)}>✏️ Bearbeiten (Düzenle)</button>
                        <button className="btn btn-outline" style={{ fontSize: "0.75rem", padding: "0.3rem 0.7rem" }} onClick={() => togglePublish(r.id, r.published)}>{r.published ? "Depublizieren (Kaldır)" : "Veröffentlichen (Yayınla)"}</button>
                        <button className="btn btn-danger" style={{ fontSize: "0.75rem", padding: "0.3rem 0.7rem" }} onClick={() => deleteRecipe(r.id)}>Löschen (Sil)</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">{editingId ? "Rezept bearbeiten (Tarifi Düzenle)" : mode === "paste" ? "Rezept einfügen (Tarif Yapıştır)" : "Rezeptdetails (Tarif Detayları)"}</div>

            {/* ── PASTE MODE ── */}
            {!editingId && mode === "paste" && (
              <div>
                <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "1rem", marginBottom: "1.25rem" }}>
                  <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", color: "var(--muted)", marginBottom: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Unterstützte Formate (Desteklenen Formatlar)</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "6px", padding: "0.75rem" }}>
                      <div style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "var(--gold)", marginBottom: "0.4rem" }}>📄 Freitext (Serbest Metin)</div>
                      <div style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "var(--muted)", lineHeight: 1.6, whiteSpace: "pre" }}>{`Tarif Adı

Açıklama metni...

Zutaten
malzeme 1
malzeme 2

Zubereitung
Adım 1.
Adım 2.`}</div>
                    </div>
                    <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "6px", padding: "0.75rem" }}>
                      <div style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "var(--gold)", marginBottom: "0.4rem" }}>📋 Vorlage (Şablon)</div>
                      <div style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "var(--muted)", lineHeight: 1.6, whiteSpace: "pre" }}>{`# Tarif Adı
Kategorie: Backen
Hazırlık: 15
Pişirme: 30

## Malzemeler
- malzeme 1

## Adımlar
1. Adım 1.`}</div>
                      <button onClick={() => navigator.clipboard.writeText(TEMPLATE)} style={{ marginTop: "0.5rem", background: "none", border: "1px solid var(--border)", borderRadius: "4px", padding: "0.2rem 0.5rem", fontSize: "0.7rem", color: "var(--muted)", cursor: "pointer" }}>Kopieren (Kopyala)</button>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Rezepttext einfügen (Tarif metnini yapıştırın) *</label>
                  <textarea
                    className="form-textarea"
                    style={{ minHeight: "200px", fontFamily: "system-ui, sans-serif", fontSize: "0.88rem" }}
                    value={pasteText}
                    onChange={(e) => { setPasteText(e.target.value); setParseError(""); }}
                    placeholder="Kopierten Text hier einfügen... (Kopyalanan metni buraya yapıştırın...)"
                  />
                </div>

                {parseError && (
                  <div style={{ background: "rgba(192,57,43,0.12)", border: "1px solid rgba(192,57,43,0.35)", borderRadius: "6px", padding: "0.6rem 0.9rem", color: "#e74c3c", fontFamily: "system-ui, sans-serif", fontSize: "0.85rem", marginBottom: "1rem" }}>⚠️ {parseError}</div>
                )}

                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={closeModal}>Abbrechen (İptal)</button>
                  <button type="button" className="btn btn-primary" onClick={handleParsePaste}>Analysieren und weiter (Ayrıştır ve Devam Et) →</button>
                </div>
              </div>
            )}

            {/* ── MANUAL / REVIEW MODE ── */}
            {(editingId || mode === "manual") && (
              <form onSubmit={handleSave}>
                {!editingId && (
                  <div style={{ marginBottom: "1.25rem" }}>
                    <button type="button" onClick={() => { setMode("paste"); setParseError(""); }} style={{ background: "none", border: "none", color: "var(--gold)", fontFamily: "system-ui, sans-serif", fontSize: "0.85rem", cursor: "pointer", padding: 0 }}>← Zurück (Geri)</button>
                    <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", color: "var(--muted)", marginLeft: "0.75rem" }}>Rezept analysiert — bitte prüfen und speichern. (Tarif ayrıştırıldı — kontrol edip kaydet.)</span>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group" style={{ gridColumn: "1/-1" }}>
                    <label className="form-label">Titel (Başlık) *</label>
                    <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div className="form-group" style={{ gridColumn: "1/-1" }}>
                    <label className="form-label">Beschreibung (Açıklama)</label>
                    <textarea className="form-textarea" style={{ minHeight: "80px" }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kategorie (Kategori)</label>
                    <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c} ({CAT_TR[c]})</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kochzeit in Min. (Pişirme süresi dk.)</label>
                    <input className="form-input" type="number" min="0" value={form.cookTime} onChange={(e) => setForm({ ...form, cookTime: e.target.value })} required />
                  </div>
                  <div className="form-group" style={{ gridColumn: "1/-1" }}>
                    <label className="form-label">Bild (Görsel)</label>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <input className="form-input" type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://... oder unten hochladen (veya aşağıdan yükle)" />
                      <label style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                        <span className="btn btn-outline" style={{ fontSize: "0.8rem", padding: "0.5rem 0.9rem" }}>
                          {uploading ? "Wird hochgeladen... (Yükleniyor...)" : "📁 Datei wählen (Dosya Seç)"}
                        </span>
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} disabled={uploading} />
                      </label>
                    </div>
                    {form.imageUrl && <img src={form.imageUrl} alt="Vorschau" style={{ marginTop: "0.5rem", maxHeight: "120px", borderRadius: "8px", objectFit: "cover" }} />}
                  </div>
                  <div className="form-group" style={{ gridColumn: "1/-1" }}>
                    <label className="form-label">Zutaten – eine pro Zeile (Malzemeler – her satıra bir tane) *</label>
                    <textarea className="form-textarea" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} required />
                  </div>
                  <div className="form-group" style={{ gridColumn: "1/-1" }}>
                    <label className="form-label">Zubereitung – ein Schritt pro Zeile (Yapılış – her satıra bir adım) *</label>
                    <textarea className="form-textarea" value={form.steps} onChange={(e) => setForm({ ...form, steps: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontFamily: "system-ui, sans-serif", fontSize: "0.9rem", color: "var(--muted)" }}>
                      <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                      {editingId ? "Veröffentlicht (Yayında)" : "Sofort veröffentlichen (Hemen Yayınla)"}
                    </label>
                  </div>
                </div>

                {msg && <div style={{ marginTop: "1rem", padding: "0.6rem 0.9rem", borderRadius: "6px", background: "var(--bg)", fontFamily: "system-ui, sans-serif", fontSize: "0.88rem" }}>{msg}</div>}

                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={closeModal}>Abbrechen (İptal)</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Wird gespeichert... (Kaydediliyor...)" : editingId ? "Änderungen speichern (Değişiklikleri Kaydet)" : "Rezept speichern (Tarifi Kaydet)"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
