# ─────────────────────────────────────────────
# Retrieve Countries — Makefile
# ─────────────────────────────────────────────

.DEFAULT_GOAL := help

APP          := retrieve-countries
DC_PROD      := docker compose -f docker-compose.yml
DC_DEV       := docker compose -f docker-compose.dev.yml

.PHONY: dev prod down logs build test lint lint-fix format format-fix typecheck ci install clean help

# ── Docker ───────────────────────────────────
dev: ## Start dev containers (hot-reload)
	$(DC_DEV) up --build

prod: ## Start production containers
	$(DC_PROD) up -d --build

down: ## Stop all containers
	@$(DC_DEV) down 2>/dev/null || true
	@$(DC_PROD) down -v 2>/dev/null || true

logs: ## Tail container logs
	@docker compose logs -f

# ── Local ────────────────────────────────────
install: ## Install dependencies
	npm ci

build: ## Compile TypeScript
	npm run build

test: ## Run tests
	npm test

lint: ## Run ESLint
	npm run lint

lint-fix: ## Run ESLint with auto-fix
	npm run lint:fix

format: ## Check code formatting (Prettier)
	npm run format:check

format-fix: ## Fix code formatting (Prettier)
	npm run format

typecheck: ## Type-check without emitting (tsc --noEmit)
	npm run typecheck

ci: lint format typecheck test build ## Run full CI checks locally

clean: ## Remove build artifacts and caches
	rm -rf dist coverage node_modules/.cache

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'
