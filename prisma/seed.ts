import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "goldene.rezepte@gmail.com" },
    update: {},
    create: { email: "goldene.rezepte@gmail.com", password: hash, name: "Admin" },
  });

  const recipes = [
    {
      slug: "sauerbraten",
      title: "Rheinischer Sauerbraten",
      description: "Der klassische deutsche Sonntagsbraten – zart mariniert und mit einer würzigen Soße serviert.",
      category: "Hauptgerichte",
      prepTime: 30,
      cookTime: 180,
      servings: 6,
      difficulty: "Mittel",
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600",
      ingredients: JSON.stringify(["1,5 kg Rinderbraten", "500 ml Rotweinessig", "500 ml Wasser", "2 Zwiebeln", "2 Lorbeerblätter", "10 Pfefferkörner", "2 EL Zucker", "Salz", "3 EL Butterschmalz", "200 g Rosinen"]),
      steps: JSON.stringify(["Fleisch 3–5 Tage in Marinade einlegen.", "Fleisch abtupfen und in Butterschmalz von allen Seiten anbraten.", "Marinade angießen, Lorbeerblätter zugeben.", "3 Stunden bei 160 °C schmoren.", "Soße mit Rosinen abschmecken."]),
      published: true,
    },
    {
      slug: "kartoffelsuppe",
      title: "Hausgemachte Kartoffelsuppe",
      description: "Cremig, sättigend und wärmend – ein Klassiker aus der deutschen Hausmannskost.",
      category: "Suppen",
      prepTime: 15,
      cookTime: 35,
      servings: 4,
      difficulty: "Einfach",
      imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600",
      ingredients: JSON.stringify(["800 g Kartoffeln", "1 Zwiebel", "2 Karotten", "200 g Sellerie", "1 L Gemüsebrühe", "100 ml Sahne", "Majoran", "Salz", "Pfeffer"]),
      steps: JSON.stringify(["Gemüse schälen und würfeln.", "Zwiebeln in Butter andünsten.", "Kartoffeln und Gemüse zugeben, mit Brühe aufgießen.", "20 Minuten köcheln, dann pürieren.", "Sahne einrühren und mit Majoran abschmecken."]),
      published: true,
    },
    {
      slug: "schwarzwaelder-kirschtorte",
      title: "Schwarzwälder Kirschtorte",
      description: "Das wohl bekannteste deutsche Dessert – Schokolade, Kirschen und Sahne in Perfektion.",
      category: "Desserts",
      prepTime: 60,
      cookTime: 30,
      servings: 12,
      difficulty: "Schwer",
      imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
      ingredients: JSON.stringify(["6 Eier", "200 g Zucker", "150 g Mehl", "50 g Kakaopulver", "500 ml Sahne", "2 Gläser Kirschen", "4 EL Kirschwasser", "Schokoraspeln"]),
      steps: JSON.stringify(["Eier und Zucker schaumig schlagen.", "Mehl und Kakao unterfalten.", "Bei 180 °C 30 Min. backen.", "Boden dreimal schneiden.", "Mit Sahne, Kirschen und Kirschwasser schichten.", "Mit Schokoraspeln dekorieren."]),
      published: true,
    },
    {
      slug: "brezel-hausgemacht",
      title: "Hausgemachte Brezeln",
      description: "Knusprig, salzig und frisch aus dem Ofen – so schmecken echte bayerische Brezeln.",
      category: "Backen",
      prepTime: 90,
      cookTime: 15,
      servings: 8,
      difficulty: "Mittel",
      imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600",
      ingredients: JSON.stringify(["500 g Mehl", "1 Pck. Hefe", "300 ml lauwarmes Wasser", "1 TL Zucker", "2 TL Salz", "3 EL Butter", "50 g Natron", "Grobes Salz"]),
      steps: JSON.stringify(["Teig kneten und 1 Stunde gehen lassen.", "Stränge formen und zu Brezeln schlingen.", "In Natronlauge (Wasser + Natron) tauchen.", "Auf Backblech legen, salzen.", "Bei 220 °C 15 Minuten goldbraun backen."]),
      published: true,
    },
  ];

  for (const r of recipes) {
    await prisma.recipe.upsert({
      where: { slug: r.slug },
      update: {},
      create: r,
    });
  }

  console.log("✅ Seed abgeschlossen");
}

main().catch(console.error).finally(() => prisma.$disconnect());
