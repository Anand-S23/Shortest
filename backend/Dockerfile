FROM node:18-alpine

WORKDIR /usr/src/server

COPY package.json .
RUN npm install
COPY . .

RUN npm run build

# CMD ["concurrently", "\"npx tsc --watch\"", "\"nodemon -q dist/index.js\""]
CMD ["node", "./dist/index.js"]

