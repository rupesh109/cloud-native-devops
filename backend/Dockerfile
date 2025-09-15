# backend/Dockerfile
FROM mirror.gcr.io/library/node:18-alpine
WORKDIR /app
COPY package*.json ./
# install runtime deps only
RUN npm ci --omit=dev --no-audit --no-fund || npm i --omit=dev
COPY . .
ENV PORT=8080
EXPOSE 8080
CMD ["node","server.js"]
