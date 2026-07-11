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

ARG TRANSACTIONS_ZONE_ORIGIN=http://transactions:3001
ARG NEXT_PUBLIC_FINANCIAL_ALERTS_ORIGIN=http://localhost:4201
ENV TRANSACTIONS_ZONE_ORIGIN=$TRANSACTIONS_ZONE_ORIGIN
ENV NEXT_PUBLIC_FINANCIAL_ALERTS_ORIGIN=$NEXT_PUBLIC_FINANCIAL_ALERTS_ORIGIN

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn workspace web build

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app ./

EXPOSE 3000

CMD ["yarn", "workspace", "web", "start", "--hostname", "0.0.0.0", "--port", "3000"]
