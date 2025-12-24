FROM node:20-alpine

WORKDIR /app

COPY Backend/package.json Backend/package-lock.json* ./Backend/
RUN cd Backend && npm ci --no-audit --no-fund

COPY Backend/tsconfig.json ./Backend/
COPY Backend/src ./Backend/src

RUN cd Backend && npm run build

EXPOSE 3000
CMD ["node", "Backend/dist/server.js"]

