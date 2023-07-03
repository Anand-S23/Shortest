# Build Stage
FROM node:18-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --production
COPY . .

RUN npm run build

# Production Stage
FROM node:18-alpine
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package*.json ./
RUN npm ci --production
COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "./dist/index.js"]

