FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json yarn.lock turbo.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/transactions/package.json apps/transactions/package.json
COPY apps/financial-alerts-angular/package.json apps/financial-alerts-angular/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/design-system/package.json packages/design-system/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
COPY packages/utils/package.json packages/utils/package.json

RUN yarn install --frozen-lockfile

FROM node:22-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/financial-alerts-angular/node_modules ./apps/financial-alerts-angular/node_modules
COPY . .

RUN yarn workspace financial-alerts-angular build

FROM nginx:1.27-alpine AS runner

COPY apps/financial-alerts-angular/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/financial-alerts-angular/dist/financial-alerts-angular /usr/share/nginx/html

EXPOSE 80
