// Údaje časovej osi. Dátumy sú vo formáte RRRR-MM-DD, "do" je posledný deň obdobia (vrátane).
const TIMELINE = [
  {
    typ: "udalost",
    datum: "2024-11-15",
    nazov: "Autonehoda",
  },
  {
    typ: "obdobie",
    od: "2024-11-18",
    do: "2025-02-28",
    nazov: "Zastupovanie riaditeľa",
    stitok: "Zástupca riaditeľa",
    popis: "Ako zástupca riaditeľa som prebral riadenie školy. Škola nemala riaditeľa a jeho funkciu som suploval.",
    farba: "amber",
  },
  {
    typ: "obdobie",
    od: "2025-03-01",
    do: "2025-06-30",
    nazov: "Poverený riadením školy",
    stitok: "Poverenie",
    popis: "Bol som poverený riadením školy do konca školského roka 2024/2025.",
    farba: "blue",
  },
  {
    typ: "obdobie",
    od: "2025-07-01",
    do: "2030-06-30",
    nazov: "Riaditeľ školy",
    stitok: "Dekrét o vymenovaní",
    popis: "Dostal som dekrét o vymenovaní za riaditeľa školy. Začalo sa moje 5-ročné funkčné obdobie.",
    farba: "green",
    skolskeRoky: true,
  },
];
