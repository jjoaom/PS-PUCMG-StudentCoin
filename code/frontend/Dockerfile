FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force
RUN npm install --no-audit --no-fund

COPY . .