# Retrieve Countries (Legacy)

## ⚠️ Este repositorio ha sido migrado y archivado

Este proyecto ha sido **migrado y mejorado** como parte de una transición hacia una arquitectura más estable y mantenible:

- La base de datos fue migrada desde **MongoDB a MariaDB**, permitiendo mejores relaciones y rendimiento.
- El servicio se integró en un **monorepo consolidado** junto a otros proyectos de datos abiertos.
- Ahora se ejecuta en un **servidor propio más estable**, lo que permite mantener los servicios disponibles de forma **gratuita y continua** para la comunidad.

👉 El nuevo repositorio actualizado se encuentra en:  
🔗 [open-data-service/apps/countries](https://github.com/rgdevment/open-data-service/tree/main/apps/countries)

> Este repositorio permanecerá como referencia histórica, pero **no recibirá más actualizaciones**.

[![Build CI](https://github.com/rgdevment/retrieve-countries/actions/workflows/main.yml/badge.svg)](https://github.com/rgdevment/retrieve-countries/actions/workflows/main.yml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=rgdevment_retrieve-countries&metric=coverage)](https://sonarcloud.io/dashboard?id=rgdevment_retrieve-countries)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=rgdevment_retrieve-countries&metric=alert_status)](https://sonarcloud.io/dashboard?id=rgdevment_retrieve-countries)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Retrieve Countries es una API REST de código abierto bajo la licencia MIT que te permite consultar datos sobre países, ciudades y otra información relevante en todo el mundo. Esta API está en continuo desarrollo y crecimiento.

El mantenimiento de este repositorio se ha movido a: [open-data-service/apps/countries](https://github.com/rgdevment/open-data-service/tree/main/apps/countries)

## Disponible en otros idiomas:
- [English (Inglés)](https://github.com/rgdevment/open-data-service/blob/main/apps/countries/README.md)

## Documentación

- [Documentación Swagger](https://countries.apirest.cl/v1/docs)

## Ejemplos de uso

Puedes obtener información sobre un país y sus ciudades con esta simple llamada:

	curl -X GET "https://countries.apirest.cl/v1/chile"

O, si lo prefieres, puedes obtener todos los países de una región específica:

	curl -X GET "https://countries.apirest.cl/v1/region/americas"

Incluso puedes obtener todos los países del mundo con una sola petición:

	curl -X GET "https://countries.apirest.cl/v1/all"

También puedes mostrar u ocultar información adicional con los siguientes **parámetros opcionales**:

- `excludeCities` (opcional): booleano
- `excludeStates` (opcional): booleano

Para más información y otros endpoints, consulta la Documentación en Postman o Swagger.

## Instrucciones para instalación local

Si quieres probar el proyecto localmente o montarlo en tu propio entorno, sigue estos pasos.

### Requisitos

- **Node.js**: 20.x LTS
- **Yarn**: 4.4

### Instalación

1. Clona el repositorio:
    - git clone https://github.com/rgdevment/retrieve-countries
    - cd retrieve-countries

2. Instala las dependencias:
    - yarn install

3. Configura las variables de entorno:
    - cp .env.example .env
    - Edita el archivo `.env` con tus propios valores.

4. Ejecuta el proyecto:
    - yarn start:dev

Este comando levantará la API en un entorno de desarrollo.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
