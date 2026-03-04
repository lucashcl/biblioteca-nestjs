FROM node:lts-alpine as builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:lts-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
