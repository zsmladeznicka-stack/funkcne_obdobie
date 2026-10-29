# Časová os riadenia školy

Jednoduchá statická webstránka, ktorá zobrazuje časovú os riadenia školy:

| Obdobie | Od | Do |
|---|---|---|
| Autonehoda | 15. 11. 2024 | – |
| Zastupovanie riaditeľa (škola bez riaditeľa) | 18. 11. 2024 | 28. 2. 2025 |
| Poverený riadením školy | 1. 3. 2025 | 30. 6. 2025 |
| Riaditeľ školy – 5-ročné funkčné obdobie | 1. 7. 2025 | 30. 6. 2030 |

Stránka automaticky počíta aktuálny stav (značka „dnes“, percento uplynutého funkčného obdobia, priebeh jednotlivých školských rokov).

## Úprava údajov

Všetky dátumy a texty sú v súbore [`data.js`](data.js).

## Spustenie lokálne

Stačí otvoriť `index.html` v prehliadači.

## Zverejnenie cez GitHub Pages

1. Nahrajte repozitár na GitHub.
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch**, vetva `main`, priečinok `/ (root)`.
3. Stránka bude dostupná na `https://<používateľ>.github.io/<repozitár>/`.
