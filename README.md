# Rectifier Lab

Interactive diode / thyristor rectifier simulator (1φ & 3φ, half-wave & full-wave) with schematics and waveforms.
Plain HTML + CSS + JS. No build step, no dependencies.

## Run locally
Open `index.html` in a browser (or `python3 -m http.server` and visit http://localhost:8000).

## Deploy on GitHub Pages
1. Create a new repo on GitHub and push these files to the `main` branch (files at the repo root).
2. Repo -> Settings -> Pages -> Build and deployment -> Source: "Deploy from a branch".
3. Branch: `main`, folder: `/ (root)` -> Save.
4. After about a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

## Files
- `index.html` page structure
- `style.css` styling (light/dark)
- `app.js` simulation, schematics, waveform plotting
