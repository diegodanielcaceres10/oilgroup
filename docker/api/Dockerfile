FROM node:20-bookworm-slim

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./
RUN npm ci

COPY backend/ ./

EXPOSE 5000

CMD ["npm", "start"]
