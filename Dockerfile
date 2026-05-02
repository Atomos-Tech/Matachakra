# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package.json package-lock.json ./

# Install ALL deps (including devDeps — needed for vite build)
RUN npm ci

# Copy source
COPY . .

# Build the app (outputs dist/client + dist/server)
RUN npm run build

# ── Stage 2: Production image ─────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
# Cloud Run injects $PORT; default 8080 for local testing
ENV PORT=8080

# Copy built output and the Node.js server bootstrap
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/server.mjs ./server.mjs

EXPOSE 8080

CMD ["node", "server.mjs"]
