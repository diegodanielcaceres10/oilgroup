FROM node:20-bookworm-slim

WORKDIR /app

# phantomjs-prebuilt (used by the legacy html-pdf package) extracts a .tar.bz2
# archive and needs Fontconfig at runtime.
RUN apt-get update \
    && apt-get install --no-install-recommends -y bzip2 fontconfig \
    && rm -rf /var/lib/apt/lists/*

COPY backend/package.json backend/package-lock.json ./
RUN npm ci

COPY backend/ ./

EXPOSE 5000

CMD ["npm", "start"]
