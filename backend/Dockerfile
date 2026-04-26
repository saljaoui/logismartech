FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma.config.ts ./prisma.config.ts
COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src
COPY .env.example ./.env.example

RUN chown -R node:node /app
USER node

ENV NODE_ENV=production
ENV PORT=4000
ENV DATABASE_URL=file:./prisma/dev.db

EXPOSE 4000

CMD ["sh", "-c", "npx prisma db push && node src/index.js"]
