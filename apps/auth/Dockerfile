FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json yarn.lock turbo.json ./
COPY apps/auth/package.json apps/auth/package.json
COPY packages/auth/package.json packages/auth/package.json
COPY packages/design-system/package.json packages/design-system/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/i18n/package.json packages/i18n/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json

RUN yarn install --frozen-lockfile

FROM node:22-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_APP_ORIGIN=http://localhost:3000
ARG NEXT_PUBLIC_AUTH_ORIGIN=http://localhost:3002
ARG AUTH_ASSET_PREFIX=/auth-static
ENV NEXT_PUBLIC_APP_ORIGIN=$NEXT_PUBLIC_APP_ORIGIN
ENV NEXT_PUBLIC_AUTH_ORIGIN=$NEXT_PUBLIC_AUTH_ORIGIN
ENV AUTH_ASSET_PREFIX=$AUTH_ASSET_PREFIX

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN AUTH_SECRET=build-only-secret-not-used-at-runtime yarn workspace auth build

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3002
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app ./

EXPOSE 3002

CMD ["yarn", "workspace", "auth", "start", "--hostname", "0.0.0.0", "--port", "3002"]
