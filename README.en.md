# Retrieve Countries (Legacy)

The repository is moved to: [https://github.com/rgdevment/open-data-service](https://github.com/rgdevment/open-data-service/blob/main/apps/countries/README.md)

[![Build CI](https://github.com/rgdevment/retrieve-countries/actions/workflows/main.yml/badge.svg)](https://github.com/rgdevment/retrieve-countries/actions/workflows/main.yml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=rgdevment_retrieve-countries&metric=coverage)](https://sonarcloud.io/dashboard?id=rgdevment_retrieve-countries)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=rgdevment_retrieve-countries&metric=alert_status)](https://sonarcloud.io/dashboard?id=rgdevment_retrieve-countries)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Retrieve Countries is an open-source REST API licensed under MIT that allows you to query data about countries, cities, and other relevant information worldwide. This API is continuously developing and growing.

The repository is moved to: [https://github.com/rgdevment/open-data-service](https://github.com/rgdevment/open-data-service/blob/main/apps/countries/README.md)

## Available in other languages:
- [Spanish (Español)](https://github.com/rgdevment/open-data-service/blob/main/apps/countries/README.md)

## Documentation

- [Swagger Documentation](https://countries.apirest.cl/v1/docs)

## Usage examples

You can get information about a country and its cities with this simple call:

	curl -X GET "https://countries.apirest.cl/v1/chile"

Or, if you prefer, you can get all the countries in a specific region:

	curl -X GET "https://countries.apirest.cl/v1/region/americas"

You can even get all the countries in the world with a single request:

	curl -X GET "https://countries.apirest.cl/v1/all"

You can also show or hide additional information with the following **optional parameters**:

- `excludeCities` (optional): boolean
- `excludeStates` (optional): boolean

For more information and other endpoints, refer to the Postman or Swagger Documentation.

## Local installation instructions

If you want to try the project locally or set it up in your own environment, follow these steps.

### Requirements

- **Node.js**: 20.x LTS
- **Yarn**: 4.4

### Installation

1. Clone the repository:
    - git clone https://github.com/rgdevment/retrieve-countries
    - cd retrieve-countries

2. Install the dependencies:
    - yarn install

3. Set up environment variables:
    - cp .env.example .env
    - Edit the `.env` file with your own values.

4. Run the project:
    - yarn start:dev

This command will launch the API in a development environment.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
