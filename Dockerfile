FROM node:18-alpine AS base

FROM base as app_base

# Make UPLOAD_DIRs
ENV UPLOAD_DIR=/uploads
RUN mkdir $UPLOAD_DIR
RUN mkdir $UPLOAD_DIR/banners $UPLOAD_DIR/cvs $UPLOAD_DIR/avatars $UPLOAD_DIR/logos $UPLOAD_DIR/attachments

# Prisma base image only for installing prisma
FROM base AS prisma_base
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install prisma --omit=dev

FROM prisma_base AS deps
WORKDIR /app

# Won't need to re-install prisma, since it's already installed in the prisma_base image
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM app_base AS runner
WORKDIR /app

# Disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown node:node .next

# Copy prisma schema
COPY --from=builder --chown=node:node /app/prisma ./prisma

# Copy over the prisma client
COPY --from=prisma_base /app/node_modules ./node_modules

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Take ownership of the app folder and uploads
RUN chown node:node /app
RUN chown -R node:node $UPLOAD_DIR

USER node

EXPOSE 3000

ENV PORT=3000

CMD HOSTNAME="0.0.0.0" node server.js
