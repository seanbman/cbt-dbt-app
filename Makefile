.PHONY: dev build test templ css js-check validate clean

BINARY_NAME=steady-steps
CMD=./cmd/server
GO=go
NPM=npm

dev: templ css
	$(GO) run $(CMD)

build: templ css
	$(GO) build -o $(BINARY_NAME) $(CMD)

test: templ
	$(GO) test ./...
	$(NPM) test

templ:
	$(GO) tool templ generate

css:
	$(NPM) run build:css

js-check:
	$(NPM) run check:js

validate: templ css js-check
	gofmt -w .
	$(GO) mod tidy
	git diff --check
	$(GO) test ./...
	$(GO) build ./...
	$(NPM) test

clean:
	rm -f $(BINARY_NAME)
