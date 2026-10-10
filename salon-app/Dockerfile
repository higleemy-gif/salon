# Build the Vite app, then serve the static files with nginx.
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# VITE_API_URL is inlined by Vite at build time. Default points at the deployed
# backend; override by passing --build-arg VITE_API_URL=... if the backend URL changes.
ARG VITE_API_URL=http://nsewpvj7asfhnlq4cgmyrfnc.187.53.143.234.sslip.io
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# SPA fallback so client-side routes (e.g. /bill, /bills) work on refresh.
RUN printf 'server {\n  listen 80;\n  server_name _;\n  root /usr/share/nginx/html;\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
