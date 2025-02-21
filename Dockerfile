# Base stage
FROM node:22-alpine AS base

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

# Development stage
FROM node:22-alpine AS dev

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY --from=base /usr/src/app/node_modules ./node_modules

COPY . .

ENV PORT 5000
EXPOSE 5000

CMD [ "npm", "run", "dev" ]

# Build stage
FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY --from=base /usr/src/app/node_modules ./node_modules

COPY . .

RUN npm run build


# Production stage configure nginx later
FROM node:22-alpine AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json package-lock.json ./

COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/index.js" ]