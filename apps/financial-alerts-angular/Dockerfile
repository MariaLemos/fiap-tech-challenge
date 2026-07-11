FROM node:22-alpine AS deps

WORKDIR /app

COPY yarn.lock ./
COPY apps/financial-alerts-angular/package.json ./package.json

RUN yarn install --frozen-lockfile

FROM node:22-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY apps/financial-alerts-angular/ ./

RUN yarn build

FROM nginx:1.27-alpine AS runner

COPY apps/financial-alerts-angular/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/financial-alerts-angular /usr/share/nginx/html

EXPOSE 80
