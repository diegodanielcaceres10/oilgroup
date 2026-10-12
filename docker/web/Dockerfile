# Angular CLI 11 supports Node 10-14 and npm 6-7.
FROM node:14-bullseye

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./

RUN npm install --global npm@8

RUN npm ci --legacy-peer-deps

COPY frontend/ ./

EXPOSE 4200

CMD ["npm", "start"]
