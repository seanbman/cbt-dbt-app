# Steady Steps

Steady Steps is a privacy-first, self-guided exercise toolbox built with Go, Echo, templ, Tailwind CSS, browser-local IndexedDB persistence, and a small PWA foundation.

The product is intended to support original CBT-based, DBT-informed, SMART Recovery-inspired, and recovery-focused exercises. It is not a clinical portal, diagnostic tool, crisis service, or replacement for professional care.

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

On a clean checkout, download the Go module graph and generate templ output before tidying modules so Go can see the generated view packages:

```bash
npm install
npm run build:css
go mod download github.com/a-h/templ github.com/labstack/echo/v4
go mod download all
go tool templ generate
go mod tidy
go run ./cmd/server
```

Open `http://localhost:8080`.

## Validation

```bash
gofmt -w .
go mod download github.com/a-h/templ github.com/labstack/echo/v4
go mod download all
go tool templ generate
go mod tidy
git diff --check
go test ./...
go build ./...
npm run build:css
npm test
```

The CI workflow also starts the server and checks the initial routes, the help page, static CSS, manifest, and service-worker asset.

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

All rendered HTML lives in `.templ` files. Route registration stays in `internal/server/routes.go`, HTTP rendering stays in `internal/server/handlers`, exercise-domain types and validation stay in `internal/exercises`, and browser-only persistence lives in `static/js/indexeddb.js`.

## Phase 0 scope

Phase 0 establishes the foundation only. The completed exercise library, full worksheet runner, saved-session interface, recommendation flow, and expanded offline support belong to later phases.
