# ---------- build stage ----------
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund || npm i
COPY . .
# make sure any bin scripts are executable on alpine
RUN apk add --no-cache dos2unix \
 && find node_modules/.bin -type f -exec dos2unix {} \; \
 && chmod -R +x node_modules/.bin \
 && npm run build

# ---------- runtime stage ----------
FROM nginx:1.27-alpine
RUN apk add --no-cache gettext && rm -f /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 8080
CMD ["/bin/sh","-c","envsubst '$$BACKEND_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
