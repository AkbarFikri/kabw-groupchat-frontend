# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:22.15.1-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --frozen-lockfile

COPY . .

# Build dengan placeholder — akan di-replace saat runtime
ENV VITE_API_BASE_URL=__VITE_API_BASE_URL__
ENV VITE_SOCKET_URL=__VITE_SOCKET_URL__

RUN npm run build

# ─── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM node:22.15.1-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]