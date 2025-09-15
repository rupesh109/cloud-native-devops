# ---------- build stage ----------
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund || npm i
COPY . .
RUN npm run build

# ---------- runtime stage ----------
FROM nginx:1.27-alpine
RUN apk add --no-cache gettext && rm -f /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
ENV PORT=8080
EXPOSE 8080
CMD ["/bin/sh","-c","envsubst '$$BACKEND_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
