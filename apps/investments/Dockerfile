FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json yarn.lock turbo.json ./
COPY apps/auth/package.json apps/auth/package.json
COPY apps/web/package.json apps/web/package.json
COPY apps/investments/package.json apps/investments/package.json
COPY apps/financial-alerts-angular/package.json apps/financial-alerts-angular/package.json
COPY packages/auth/package.json packages/auth/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/design-system/package.json packages/design-system/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/i18n/package.json packages/i18n/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
COPY packages/utils/package.json packages/utils/package.json

RUN yarn install --frozen-lockfile

FROM node:22-alpine AS builder

WORKDIR /app
ARG NEXT_PUBLIC_AUTH_ORIGIN=http://localhost:3002
ENV NEXT_PUBLIC_AUTH_ORIGIN=$NEXT_PUBLIC_AUTH_ORIGIN
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN AUTH_SECRET=build-only-secret-not-used-at-runtime yarn workspace investments build

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app ./

EXPOSE 3001

CMD ["yarn", "workspace", "investments", "start", "--hostname", "0.0.0.0", "--port", "3001"]
