FROM node:16.20.0-alpine
LABEL author="Dino Dujmovic"

RUN apk --no-cache add --virtual builds-deps build-base python3

WORKDIR /usr/src/data
WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
CMD npm run start:dev
