# ─────────────────────────────────────────────
# Retrieve Countries — Makefile
# ─────────────────────────────────────────────

.DEFAULT_GOAL := help

# ── Variables ────────────────────────────────
APP_NAME     := retrieve-countries
COMPOSE_PROD := docker compose -f docker-compose.yml
COMPOSE_DEV  := docker compose -f docker-compose.dev.yml

# ── Development (local) ─────────────────────
.PHONY: install dev start build test test-cov lint lint-fix format

install: ## Install dependencies
	npm ci

dev: ## Start in watch mode (local)
	npm run start:dev

start: ## Start compiled app (local)
	npm run start:prod

build: ## Compile TypeScript
	npm run build

test: ## Run tests
	npm test

test-cov: ## Run tests with coverage
	npm run test:cov

lint: ## Lint source code
	npm run lint

lint-fix: ## Lint + auto-fix
	npm run lint:fix

format: ## Format source code with Prettier
	npm run format

# ── Docker Development ──────────────────────
.PHONY: docker-dev docker-dev-down docker-dev-logs

docker-dev: ## Start dev containers (hot-reload)
	$(COMPOSE_DEV) up --build

docker-dev-down: ## Stop dev containers
	$(COMPOSE_DEV) down

docker-dev-logs: ## Tail dev container logs
	$(COMPOSE_DEV) logs -f

# ── Docker Production ───────────────────────
.PHONY: docker-prod docker-prod-down docker-prod-logs docker-build

docker-build: ## Build production image
	docker build --target production -t $(APP_NAME) .

docker-prod: ## Start production containers
	$(COMPOSE_PROD) up -d --build

docker-prod-down: ## Stop production containers & remove volumes
	$(COMPOSE_PROD) down -v

docker-prod-logs: ## Tail production logs
	$(COMPOSE_PROD) logs -f

# ── Utilities ────────────────────────────────
.PHONY: clean help

clean: ## Remove build artifacts and caches
	rm -rf dist coverage node_modules/.cache

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'
