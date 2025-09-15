# --- build static React app ---
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund || npm i
COPY . .

# Normalize Windows line endings and ensure .bin is executable
RUN apk add --no-cache dos2unix \
 && find node_modules/.bin -type f -exec dos2unix {} \; \
 && chmod +x node_modules/.bin/* \
 # Call react-scripts directly via node to avoid shebang/permission quirks
 && node node_modules/react-scripts/bin/react-scripts.js build

# --- nginx runtime for Cloud Run ---
FROM nginx:1.27-alpine
RUN apk add --no-cache gettext \
 && rm -f /etc/nginx/conf.d/default.conf

ENV PORT=8080
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 8080
CMD /bin/sh -c "envsubst '\$PORT \$BACKEND_URL' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf \
  && exec nginx -g 'daemon off;'"
