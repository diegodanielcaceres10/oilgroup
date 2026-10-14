# Angular CLI 16 supports Node 16.14+ and 18.10+.
FROM node:18-bullseye

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./

RUN npm install --global npm@8

RUN npm ci

COPY frontend/ ./

EXPOSE 4200

CMD ["npm", "start"]
