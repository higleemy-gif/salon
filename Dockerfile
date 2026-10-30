FROM node:20-alpine AS builder

WORKDIR /app

COPY salon-backend/package*.json ./
RUN npm ci --omit=dev

COPY salon-backend/prisma ./prisma/
COPY salon-backend/prisma.config.ts ./
RUN npx prisma generate

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY salon-backend/package*.json ./
COPY salon-backend/src ./src/
COPY salon-backend/bootstrap.js ./

RUN addgroup -g 1001 -S nodejs && adduser -S orrenza -u 1001 -G nodejs \
 && mkdir -p /data/whatsapp-auth && chown -R orrenza:nodejs /data
USER orrenza

ENV NODE_ENV=production
# WhatsApp session lives here. Mount a persistent volume at /data/whatsapp-auth
# so the session survives redeploys.
ENV WHATSAPP_AUTH_DIR=/data/whatsapp-auth
VOLUME ["/data/whatsapp-auth"]
EXPOSE 4000

# bootstrap.js ensures the DB exists, migrates, seeds (once), then starts the API
CMD ["node", "bootstrap.js"]
