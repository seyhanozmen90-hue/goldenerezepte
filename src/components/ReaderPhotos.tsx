import { prisma } from "@/lib/prisma";
import PhotoInvite from "./PhotoInvite";

export default async function ReaderPhotos({ recipeId }: { recipeId: number }) {
  const photos = await prisma.readerPhoto
    .findMany({ where: { recipeId, status: "approved" }, orderBy: { createdAt: "asc" }, take: 12 })
    .catch(() => []);

  return (
    <>
      {photos.length > 0 && (
        <section className="reader-photos">
          <h2 className="recipe-section-title">Nachgekocht von Lesern</h2>
          <div className="reader-photo-grid">
            {photos.map((p) => (
              <figure key={p.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={`Nachgekocht${p.name ? ` von ${p.name}` : ""}`} loading="lazy" />
                <figcaption>
                  <strong>{p.name ?? "Ein Leser"}</strong>
                  {p.comment && <span>{p.comment}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
      <PhotoInvite recipeId={recipeId} />
    </>
  );
}
