# Steady Steps

Steady Steps is a privacy-first, self-guided exercise toolbox built with Go, Echo, templ, Tailwind CSS, browser-local IndexedDB persistence, and a small PWA foundation.

The product supports original CBT-based, DBT-informed, SMART Recovery-inspired, and recovery-focused exercises. It is not a clinical portal, diagnostic tool, crisis service, or replacement for professional care.

## Privacy boundaries

- No login or account system.
- No cloud sync for worksheet drafts.
- No server-side worksheet-answer or check-in storage.
- No third-party AI processing of user answers.
- No advertising trackers.
- Sensitive worksheet drafts stay on the user's device through IndexedDB, or remain memory-only when a private session is requested.

## Requirements

- Go 1.25+
- Node.js 22+
- npm

## Local development

On a clean checkout, download the Go module graph and tidy modules before generating templ output:

```bash
npm install
npm run build:css
go mod download github.com/a-h/templ github.com/labstack/echo/v4
go mod download all
go mod tidy
go tool templ generate
go run ./cmd/server
```

Open `http://localhost:8080`.

## Validation

```bash
npm install
npm run build:css
npm test
go mod download github.com/a-h/templ github.com/labstack/echo/v4
go mod download all
go mod tidy
go tool templ generate
gofmt -w .
git diff --check
go test ./...
go build ./...
```

The CI workflow also starts the server and checks the home page, exercise library, filtered exercise results, a known exercise detail page, the calm unknown-exercise 404 page, the help page, static CSS, manifest, and service-worker asset.

## Routes

```text
/
/check-in
/exercises
/exercises/:slug
/saved
/about
/help
```

All rendered HTML lives in `.templ` files. Route registration stays in `internal/server/routes.go`, HTTP rendering stays in `internal/server/handlers`, exercise-domain types and validation stay in `internal/exercises`, and browser-only persistence lives in `static/js/indexeddb.js`.

## Phase 1 scope

Phase 1 adds the first usable exercise library: a validated static category catalog, 12 original exercises, server-rendered GET filtering, exercise detail pages, a calm unknown-slug 404 page, and print-friendly detail styling.

The recommendation engine, full worksheet runner, saved-session management interface, check-in questions, and cloud-backed features remain out of scope. Worksheet answers stay local to the browser.
