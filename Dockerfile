FROM node:18-alpine AS base

FROM base as app_base

# Make UPLOAD_DIRs
ENV UPLOAD_DIR=/uploaded
RUN mkdir $UPLOAD_DIR
RUN mkdir $UPLOAD_DIR/banners $UPLOAD_DIR/cvs $UPLOAD_DIR/avatars $UPLOAD_DIR/logos $UPLOAD_DIR/attachments

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM app_base AS runner
WORKDIR /uploads
RUN ls
WORKDIR /app

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

#RUN addgroup --system --gid 1001 nodejs
#RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown node:node .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Take ownershuip of the app folder & upload
RUN chown node:node /app
RUN chown -R node:node /uploads

USER node

EXPOSE 3000

ENV PORT=3000

CMD HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
