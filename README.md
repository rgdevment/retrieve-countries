# Retrieve Countries

API REST de código abierto (MIT) para consultar datos de países, estados y ciudades del mundo.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | NestJS 11 |
| Lenguaje | TypeScript 5.9 |
| Base de datos | SQLite (better-sqlite3 + Kysely) |
| Cache | In-memory (`@nestjs/cache-manager`) |
| Runtime | Node.js >= 22 / npm >= 11 |

## Inicio rápido

```bash
# 1. Clonar e instalar
git clone https://github.com/rgdevment/retrieve-countries
cd retrieve-countries
cp .env.example .env
npm ci

# 2. Desarrollo
make dev          # o: npm run start:dev

# 3. Tests
make test         # o: npm test
make test-cov     # o: npm run test:cov
```

## Docker

```bash
# Desarrollo (hot-reload)
make docker-dev

# Producción (imagen optimizada ~120 MB)
make docker-prod

# Parar
make docker-dev-down
make docker-prod-down
```

El Dockerfile usa multi-stage builds con targets `development` y `production`.
La imagen de producción corre con usuario no-root, `dumb-init` como PID 1 y solo dependencias de producción.

## Variables de entorno

Un solo archivo `.env` sirve para dev y prod. Ver `.env.example`:

| Variable | Default | Descripción |
|----------|---------|-------------|
| `NODE_ENV` | `development` | `development` o `production` |
| `PORT` | `3000` | Puerto del servidor |
| `DATABASE_PATH` | `./data/countries.db` | Ruta del archivo SQLite |

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/v1/health` | Health check |
| `GET` | `/v1/all` | Todos los países (sin estados por defecto) |
| `GET` | `/v1/:name` | País por nombre |
| `GET` | `/v1/capital/:capital` | País por capital |
| `GET` | `/v1/region/:region` | Países por región |
| `GET` | `/v1/subregion/:subregion` | Países por subregión |

**Parámetros opcionales:** `excludeStates`, `excludeCities` (boolean).

### Ejemplos

```bash
curl http://localhost:3000/v1/chile
curl http://localhost:3000/v1/region/americas
curl http://localhost:3000/v1/all
```

## Documentación Swagger

Disponible en `/v1/docs` cuando la APP está corriendo.

## Makefile

```
make help         # Ver todos los comandos disponibles
```

## Licencia

[MIT](LICENSE)
