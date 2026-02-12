# =============================================
# BASE — shared layer for all stages
# =============================================
FROM node:24-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

# =============================================
# DEVELOPMENT — hot-reload, full source mount
# =============================================
FROM base AS development
ENV NODE_ENV=development
RUN npm ci
COPY . .
CMD ["npm", "run", "start:dev"]

# =============================================
# BUILD — compile TypeScript only (used by prod)
# =============================================
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# =============================================
# PRODUCTION — minimal, secure, distroless-ish
# =============================================
FROM node:24-alpine AS production

# Security: no root, no shell attack surface
RUN addgroup -S app && adduser -S app -G app \
    && apk --no-cache add tini \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Copy only production artifacts
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json

# Install ONLY production deps
RUN npm ci --omit=dev --ignore-scripts \
    && npm cache clean --force \
    && rm -rf /tmp/*

# SQLite data directory
RUN mkdir -p /app/data && chown -R app:app /app

USER app

ENV NODE_ENV=production
EXPOSE 3000

# tini handles PID 1 properly (signal forwarding, zombie reaping)
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/main"]
