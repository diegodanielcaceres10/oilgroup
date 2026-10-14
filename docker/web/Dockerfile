# Angular CLI 17 supports Node 18.13+ and 20.9+.
FROM node:20-bullseye

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./

RUN npm install --global npm@8

RUN npm ci

COPY frontend/ ./

EXPOSE 4200

CMD ["npm", "start"]
