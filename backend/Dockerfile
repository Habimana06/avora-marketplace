FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat wget

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 5000

CMD ["sh", "-c", "sleep 5 && npx prisma db push && npm run db:seed || true && npm run dev"]
