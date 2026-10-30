# Build the Vite app, then serve the static files with nginx.
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# VITE_API_URL is inlined by Vite at build time, so it must be passed as a build arg
# (on Coolify: add VITE_API_URL as an environment variable with "Available at Buildtime"
# enabled). Use the backend's https:// URL; an http:// API called from an https://
# page is blocked by browsers as mixed content.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN if [ -z "$VITE_API_URL" ]; then \
      echo "ERROR: VITE_API_URL build arg is required (e.g. https://api.example.com)" >&2; exit 1; \
    fi; \
    case "$VITE_API_URL" in \
      http://localhost*|http://127.0.0.1*) ;; \
      http://*) echo "WARNING: VITE_API_URL uses http://. Browsers will block it if the app is served over https." >&2 ;; \
    esac; \
    npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# SPA fallback so client-side routes (e.g. /bill, /bills) work on refresh.
RUN printf 'server {\n  listen 80;\n  server_name _;\n  root /usr/share/nginx/html;\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
