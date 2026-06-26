# Steady Steps

Steady Steps is a privacy-first, self-guided exercise toolbox built as a React Native Web app with Vite and a Netlify-ready static deployment path.

The product supports original CBT-based, DBT-informed, SMART Recovery-inspired, and recovery-focused exercises. It is not a clinical portal, diagnostic tool, crisis service, or replacement for professional care.

## Privacy boundaries

- No login or account system.
- No cloud sync for worksheet drafts.
- No server-side worksheet-answer or check-in storage.
- No third-party AI processing of user answers.
- No advertising trackers.
- The Automatic Thought Record saves its draft as encrypted ciphertext in a browser cookie using a device-local Web Crypto key.
- Sensitive worksheet drafts should stay on the user's device unless the project deliberately changes that privacy model later.

## Requirements

- Node.js 22+
- npm

## Local development

```bash
npm install
npm run dev
```

Open the Vite dev URL shown in the terminal.

## Validation

```bash
npm install
npm test
npm run build
npm run preview
```

The CI workflow installs Node dependencies, runs the exercise catalog and routing tests, builds the React Native Web app into `dist`, serves the static output, and checks that the Netlify-style SPA fallback routes return the app shell.

## Netlify deployment

Netlify is configured through `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Routes

```text
/
/check-in
/exercises
/exercises/automatic-thought-record
/exercises/:slug
/saved
/about
/help
```

Routing is handled client-side by the React Native Web app. Netlify serves `index.html` for deep links so routes like `/exercises/automatic-thought-record` and `/exercises/thought-check` work after deployment.

## Current scope

The app currently includes a validated static exercise library, the flagship Automatic Thought Record worksheet with an emotion-wheel reference and encrypted-cookie draft saving, client-side filtering, exercise detail pages, a calm unknown-slug state, and a PWA manifest/service-worker foundation.

The recommendation engine, broader saved-session management interface, and cloud-backed features remain out of scope. Worksheet answers must stay local to the browser unless the project deliberately changes that privacy model later.
