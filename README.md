# Sito monopagina

Tutti i testi, i link e le immagini si modificano **solo** in `content.json`.
Non serve toccare HTML, CSS o JS.

## Modificare i contenuti
Apri `content.json`:
- `avatar`: URL dell'immagine del profilo
- `eyebrow`, `name`, `intro`: i testi principali
- `actions`: i pulsanti (`primary: true` = pulsante colorato)
- `links`: i link in fondo
- `meta.accent`: il colore principale (es. `#2E6E5E`)

## Pubblicare su GitHub Pages
1. Crea un repository e carica tutti i file (index.html, styles.css, main.js, content.json).
2. Vai su **Settings → Pages**.
3. In *Source* scegli il branch `main` e la cartella `/ (root)`. Salva.
4. Dopo qualche minuto il sito sarà online all'indirizzo indicato.

> Nota: il file JSON viene caricato via `fetch`, quindi aprendo `index.html` con doppio
> clic in locale non funziona. Usa GitHub Pages o un piccolo server locale
> (es. `python -m http.server`).
