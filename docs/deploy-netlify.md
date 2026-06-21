# Netlify deployment

Steady Steps is deployed as a static React Native Web app.

Build command: `npm run build`

Publish directory: `dist`

The canonical deploy settings are stored in `netlify.toml` at the repository root. The app uses client-side routing, so Netlify serves `index.html` for app paths like `/exercises/thought-check`.
