# Angular CLI 22 requires Node 22.22.3+ (or 24.15+).
FROM node:22-bookworm

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./

RUN npm ci

COPY frontend/ ./

EXPOSE 4200

CMD ["npm", "start"]
