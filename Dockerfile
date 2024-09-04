FROM node:18-alpine AS base

# Prisma base image only for installing prisma
FROM base AS prisma_base
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install prisma --omit=dev

FROM prisma_base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Won't need to re-install prisma, since it's already installed in the prisma_base image
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
ENV NEXT_TELEMETRY_DISABLED=1

# Make UPLOAD_DIRs
ENV UPLOAD_DIR=/uploads
RUN mkdir $UPLOAD_DIR
RUN mkdir $UPLOAD_DIR/banners $UPLOAD_DIR/cvs $UPLOAD_DIR/avatars $UPLOAD_DIR/logos $UPLOAD_DIR/attachments

WORKDIR /app

# Take ownership of the app folder and uploads
RUN chown node:node /app
RUN chown -R node:node $UPLOAD_DIR


# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown node:node .next

COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=prisma_base /app/node_modules ./node_modules

USER node

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

CMD ["npm", "run", "start"]
