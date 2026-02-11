# Retrieve Countries

API REST de código abierto (MIT) para consultar datos de países, estados y ciudades del mundo.

## Stack

| Capa          | Tecnología                          |
| ------------- | ----------------------------------- |
| Framework     | NestJS 11                           |
| Lenguaje      | TypeScript 5.9                      |
| Base de datos | SQLite (better-sqlite3 + Kysely)    |
| Cache         | In-memory (`@nestjs/cache-manager`) |
| Runtime       | Node.js >= 22 / npm >= 11           |

## Inicio rápido

```bash
# 1. Clonar e instalar
git clone https://github.com/rgdevment/retrieve-countries
cd retrieve-countries
cp .env.example .env
npm ci

# 2. Desarrollo (Docker)
make dev

# 3. Producción (Docker)
make prod

# 4. Tests
make test
```

## Docker

```bash
make dev          # Dev con hot-reload
make prod         # Producción (imagen optimizada ~120 MB)
make down         # Parar todos los contenedores
make logs         # Ver logs
```

El Dockerfile usa multi-stage builds con targets `development` y `production`.
La imagen de producción corre con usuario no-root, `dumb-init` como PID 1 y solo dependencias de producción.

Al iniciar, la aplicación **siempre valida y crea los índices** necesarios en la DB (dev y prod).

## Variables de entorno

Un solo archivo `.env` sirve para dev y prod. Ver `.env.example`:

| Variable        | Default                | Descripción                  |
| --------------- | ---------------------- | ---------------------------- |
| `NODE_ENV`      | `development`          | `development` o `production` |
| `PORT`          | `3000`                 | Puerto del servidor          |
| `DATABASE_PATH` | `./data/world.sqlite3` | Ruta del archivo SQLite      |

## Endpoints

| Método | Ruta              | Descripción                             |
| ------ | ----------------- | --------------------------------------- |
| `GET`  | `/health`         | Health check                            |
| `GET`  | `/v1/`            | Todos los países con estados y ciudades |
| `GET`  | `/v1/:name`       | País por nombre con estados y ciudades  |
| `GET`  | `/v1/state/:name` | Estado por nombre con ciudades          |

Las búsquedas son **case-insensitive** (e.g. `chile`, `Chile` y `CHILE` dan el mismo resultado).

### Ejemplos

```bash
curl http://localhost:3000/v1/
curl http://localhost:3000/v1/chile
curl http://localhost:3000/v1/state/antofagasta
```

## Documentación Swagger

Disponible en `/v1/docs` cuando la APP está corriendo.

## Makefile

```
make help         # Ver todos los comandos disponibles
```

## Licencia

[MIT](LICENSE)

## Agradecimientos

Este proyecto utiliza datos de [Countries, States, Cities Database](https://github.com/dr5hn/countries-states-cities-database), mantenida por [dr5hn](https://github.com/dr5hn), bajo la licencia [Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/).
