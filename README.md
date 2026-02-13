# Retrieve Countries API

Hierarchical REST API for querying countries, states/regions, and cities worldwide. Includes Smart Resolve, accent/case-insensitive search, hierarchy control, and a lightweight dropdown mode.

  <p>
    <a href="https://buymeacoffee.com/rgdevment">
      <img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-☕-FFDD00?style=flat-square&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee"/>
    </a>
  </p>

**Base URL:** `https://countries.apirest.cl/v1`

## Endpoints

### Countries

#### List all countries

```
GET /v1/
```

```bash
curl https://countries.apirest.cl/v1/
```

#### Smart Resolve — find a country by ID, ISO code, or name

Automatically resolves the `:term` parameter using the best matching strategy:

| Format   | Example | Strategy                              |
| -------- | ------- | ------------------------------------- |
| Numeric  | `44`    | Lookup by ID                          |
| 2 chars  | `CL`    | Lookup by ISO2 code                   |
| 3 chars  | `CHL`   | Lookup by ISO3 code                   |
| Anything | `Chile` | Name search (accent/case-insensitive) |

```
GET /v1/:term
```

```bash
# By ISO2 code
curl https://countries.apirest.cl/v1/CL

# By ISO3 code
curl https://countries.apirest.cl/v1/CHL

# By numeric ID
curl https://countries.apirest.cl/v1/44

# By name (accent/case-insensitive)
curl https://countries.apirest.cl/v1/chile
```

#### Filter by region (continent)

```
GET /v1/region/:name
```

```bash
curl https://countries.apirest.cl/v1/region/Americas
curl https://countries.apirest.cl/v1/region/Europe
curl https://countries.apirest.cl/v1/region/Asia
```

#### Filter by subregion

```
GET /v1/subregion/:name
```

```bash
curl "https://countries.apirest.cl/v1/subregion/South%20America"
curl "https://countries.apirest.cl/v1/subregion/Western%20Europe"
```

### States

#### Get a state/region by ID

Returns the state with its cities by default.

```
GET /v1/states/:id
```

```bash
# Antofagasta region (Chile)
curl https://countries.apirest.cl/v1/states/2113

# Without cities
curl "https://countries.apirest.cl/v1/states/2113?exclude=cities"
```

### Cities

#### Get a city by ID

```
GET /v1/cities/:id
```

```bash
# Calama (Antofagasta, Chile)
curl https://countries.apirest.cl/v1/cities/21553
```

### Search

#### Global search across countries, states, and cities

Performs a simultaneous accent/case-insensitive search. Returns results grouped by type (up to 20 per category). Minimum 2 characters.

```
GET /v1/search?q=:query
```

```bash
curl "https://countries.apirest.cl/v1/search?q=Santiago"
curl "https://countries.apirest.cl/v1/search?q=Berlin"
```

## Query Parameters

All country endpoints support these optional query parameters:

### `exclude` — hierarchy depth

Controls how deep the response tree goes. By default the full tree is returned (country → states → cities).

| Value              | Result                                   |
| ------------------ | ---------------------------------------- |
| _(empty, default)_ | Full tree: country + states + cities     |
| `cities`           | Country + states only (cities omitted)   |
| `states`           | Country only (states and cities omitted) |

```bash
# Country + states, no cities
curl "https://countries.apirest.cl/v1/CL?exclude=cities"

# Country only, no children
curl "https://countries.apirest.cl/v1/CL?exclude=states"
```

### `type` — response detail level

Controls how many fields each country object contains.

| Value              | Result                                               |
| ------------------ | ---------------------------------------------------- |
| _(empty, default)_ | All fields (region, subregion, currency, timezones…) |
| `simple`           | Only `id`, `name`, `iso2`, `emoji`                   |

```bash
# Lightweight list for a dropdown/select
curl "https://countries.apirest.cl/v1/?exclude=states&type=simple"
```

**Simple response shape:**

```json
[
  { "id": 44, "name": "Chile", "iso2": "CL", "emoji": "🇨🇱" },
  { "id": 11, "name": "Argentina", "iso2": "AR", "emoji": "🇦🇷" }
]
```

## Response Examples

### Country (full)

```bash
curl https://countries.apirest.cl/v1/CL
```

```json
{
  "id": 44,
  "name": "Chile",
  "iso2": "CL",
  "iso3": "CHL",
  "numeric_code": "152",
  "capital": "Santiago",
  "phonecode": "+56",
  "tld": ".cl",
  "native": "Chile",
  "nationality": "Chilean",
  "region": { "id": 2, "name": "Americas" },
  "subregion": { "id": 8, "name": "South America" },
  "latitude": -35.6751,
  "longitude": -71.543,
  "emoji": "🇨🇱",
  "emojiU": "U+1F1E8 U+1F1F1",
  "timezones": [{ "zoneName": "America/Punta_Arenas", "gmtOffset": -10800, "abbreviation": "..." }],
  "translations": { "es": "Chile", "fr": "Chili", "de": "Chile" },
  "currency": { "name": "Chilean peso", "code": "CLP", "symbol": "$" },
  "states": [
    {
      "id": 2113,
      "name": "Antofagasta",
      "iso2": "AN",
      "type": "region",
      "cities": [{ "id": 21553, "name": "Calama", "latitude": -22.46, "longitude": -68.93 }]
    }
  ]
}
```

### Search

```bash
curl "https://countries.apirest.cl/v1/search?q=Santiago"
```

```json
{
  "countries": [],
  "states": [
    { "id": 2832, "name": "Santiago Metropolitan", "iso2": "RM", "country_name": "Chile", "country_iso2": "CL" }
  ],
  "cities": [
    {
      "id": 21553,
      "name": "Santiago",
      "state_name": "Santiago Metropolitan",
      "country_name": "Chile",
      "country_iso2": "CL"
    }
  ]
}
```

## Health Check

```
GET /health
```

```bash
curl https://countries.apirest.cl/health
```

> The health endpoint is outside the `/v1` prefix.

## Swagger / OpenAPI

Interactive API documentation is available at [`/docs`](https://countries.apirest.cl/docs) when the application is running.

## Tech Stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Framework | NestJS 11                           |
| Language  | TypeScript 5.9                      |
| Database  | SQLite (better-sqlite3 + Kysely)    |
| Cache     | In-memory (`@nestjs/cache-manager`) |
| Runtime   | Node.js >= 22, npm >= 11            |

## License

This project is licensed under the **GNU General Public License v3.0** (GPL-3.0-only).
See [LICENSE](LICENSE) for details.

## Acknowledgements

This project uses data from [Countries, States, Cities Database](https://github.com/dr5hn/countries-states-cities-database) by [dr5hn](https://github.com/dr5hn), licensed under the [Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/).
