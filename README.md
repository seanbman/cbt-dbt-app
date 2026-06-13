# Steady Steps

Privacy-first, self-guided CBT-based, DBT-informed, SMART Recovery-inspired, and recovery-focused exercises.

Steady Steps is a calm browser-based toolbox. It is not a clinical portal, diagnostic tool, crisis service, or replacement for professional care. Worksheet answers and check-in answers stay on the user's device.

## Architecture

- Go server with Echo
- Server-rendered HTML using templ components
- Tailwind CSS for styling
- Small framework-free browser modules
- IndexedDB for browser-local worksheet drafts and progress
- Service worker and web app manifest for a minimal PWA foundation

There is no login, account system, cloud sync, worksheet-answer API, or server-side storage of sensitive user-entered answers.

## Development

Install dependencies and generate assets:

```bash
npm install
go tool templ generate
npm run build:css
```

Run the application:

```bash
go run ./cmd/server
```

The server listens on `http://localhost:8080` by default. Set `PORT` to override it.

## Validation

Run the full local validation suite:

```bash
gofmt -w .
go mod tidy
go tool templ generate
git diff --check
go test ./...
go build ./...
npm run build:css
npm run check:js
npm test
```

The CI workflow also starts the server and smoke-tests the initial routes, the help page, the manifest, the service worker, and static assets.

## Initial routes

```text
/
/check-in
/exercises
/exercises/:slug
/saved
/about
/help
```

The `/help` route keeps immediate-support information visible from the initial release, including `9-1-1` for immediate danger and call-or-text `9-8-8` suicide crisis support in Canada.
