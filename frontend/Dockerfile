# ---------- Stage 1: Build React app ----------
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
# keep your dev install for CRA builds
RUN npm install --include=dev

# (optional) normalize line endings if repo touched on Windows
RUN apt-get update && apt-get install -y dos2unix \
    && find node_modules/.bin -type f -exec dos2unix {} \; \
    && chmod +x node_modules/.bin/*

COPY . .
# avoid CRLF/perm issues with CRA wrapper
RUN node node_modules/react-scripts/bin/react-scripts.js build

# ---------- Stage 2: Serve with Nginx (templated config) ----------
FROM nginx:alpine
# needed for envsubst
RUN apk add --no-cache gettext

# static assets
COPY --from=build /app/build /usr/share/nginx/html

# use nginx.conf as a template; we'll substitute $BACKEND_URL at runtime
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 8080

# generate nginx conf from template, then start nginx
CMD ["/bin/sh", "-c", "envsubst '$$BACKEND_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
