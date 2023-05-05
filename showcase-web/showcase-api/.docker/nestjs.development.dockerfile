FROM node:12-alpine
LABEL author="Dino Dujmovic"

RUN apk --no-cache add --virtual builds-deps build-base python

WORKDIR /usr/src/data
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
CMD npm run start:dev
