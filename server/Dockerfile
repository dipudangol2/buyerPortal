# Stage 1: Build the server
FROM node:24-alpine as base

FROM base AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Run the server
FROM base as runner
WORKDIR /app

COPY --from=builder /app/package.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 8000

CMD ["node", "dist/index.js"]
