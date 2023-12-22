FROM node:18-alpine

WORKDIR /usr/src/reactapp

COPY package*.json tsconfig.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]

EXPOSE 5173