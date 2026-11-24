const FACEBOOK = "https://www.facebook.com/profile.php?id=61588997481232";

export default function PhotoInvite({ title }: { title: string }) {
  const subject = encodeURIComponent(`Mein Foto zu: ${title}`);
  return (
    <aside className="photo-invite" aria-label="Dein Foto">
      <strong>Hast du das Rezept nachgekocht?</strong>
      <p>
        Schick uns dein Foto! Wir zeigen es mit deiner Erlaubnis hier auf der Seite.
        Am liebsten als Kommentar auf{" "}
        <a href={FACEBOOK} target="_blank" rel="noopener noreferrer">unserer Facebook-Seite</a>
        {" "}oder per{" "}
        <a href={`mailto:goldene.rezepte@gmail.com?subject=${subject}`}>E-Mail</a>.
      </p>
    </aside>
  );
}
