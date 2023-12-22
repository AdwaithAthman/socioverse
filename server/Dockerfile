# ---- Build Stage ----
FROM node:18-alpine AS build

WORKDIR /usr/src/nodeapp

COPY package*.json tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

# ---- Run Stage ----
FROM node:18-alpine

WORKDIR /usr/src/nodeapp

COPY package*.json ./

RUN npm install --only=production

COPY --from=build /usr/src/nodeapp/build ./build

CMD ["npm", "run", "start"]

EXPOSE 8000