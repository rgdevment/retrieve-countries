# Retrieve Countries

[![Sponsor rgdevment](https://img.shields.io/badge/Sponsor-rgdevment-blue?logo=github)](https://github.com/sponsors/rgdevment)
[![Build CI](https://github.com/rgdevment/retrieve-countries/actions/workflows/main.yml/badge.svg)](https://github.com/rgdevment/retrieve-countries/actions/workflows/main.yml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=rgdevment_retrieve-countries&metric=coverage)](https://sonarcloud.io/dashboard?id=rgdevment_retrieve-countries)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=rgdevment_retrieve-countries&metric=alert_status)](https://sonarcloud.io/dashboard?id=rgdevment_retrieve-countries)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Retrieve Countries es una API REST de código abierto bajo la licencia MIT que te permite consultar datos sobre países, ciudades y otra información relevante en todo el mundo. Esta API está en continuo desarrollo y crecimiento.

## Disponible en otros idiomas:
- [English (Inglés)](README.en.md)

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

## Donaciones

Este proyecto se mantiene de manera gratuita para todos. Si encuentras útil esta API y deseas apoyar su mantenimiento, puedes contribuir con una donación voluntaria.

Las donaciones se destinarán exclusivamente a cubrir los costos de infraestructura, que incluyen:

- **Google Cloud Run**: Servicio que aloja y ejecuta la API, cubriendo los costos de CPU, memoria y tiempo de ejecución.
- **Dominio**: Los costos del registro y mantenimiento de los dominios `apirest.cl` y `restapi.cl`.
- **Almacenamiento**: Si es necesario, los fondos cubrirán los costos de bases de datos externas o servicios de almacenamiento.
- **Tráfico de red**: Costos adicionales relacionados con el uso de red y la transferencia de datos.
- **Certificados SSL**: Parte de las donaciones se destinarán a la compra o renovación de certificados SSL para conexiones seguras, si es necesario.

¡Cualquier aporte es bienvenido y ayudará a mantener el servicio activo y disponible para todos!

Considera [ser un patrocinador](https://github.com/sponsors/rgdevment). ¡Gracias por tu apoyo!

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
