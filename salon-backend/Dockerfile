FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npx prisma generate

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY package*.json ./
COPY src ./src/
COPY bootstrap.js ./

RUN addgroup -g 1001 -S nodejs && adduser -S orrenza -u 1001 -G nodejs \
 && mkdir -p /data/whatsapp-auth && chown -R orrenza:nodejs /data
USER orrenza

ENV NODE_ENV=production
# WhatsApp session lives here. Mount a persistent volume at /data/whatsapp-auth
# so the session survives redeploys.
ENV WHATSAPP_AUTH_DIR=/data/whatsapp-auth
VOLUME ["/data/whatsapp-auth"]
EXPOSE 4000

# Same startup as the root Dockerfile: ensure DB, migrate, seed once, start API.
CMD ["node", "bootstrap.js"]
