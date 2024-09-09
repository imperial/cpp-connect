# Stage 1: Build
FROM node:18-alpine AS builder

ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build


# Stage 2: Production
FROM node:18-alpine AS runner

ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Make UPLOAD_DIRs
ENV UPLOAD_DIR=/uploads
RUN mkdir $UPLOAD_DIR
RUN mkdir $UPLOAD_DIR/banners $UPLOAD_DIR/cvs $UPLOAD_DIR/avatars $UPLOAD_DIR/logos $UPLOAD_DIR/attachments
RUN chown node:node /app
RUN chown -R node:node $UPLOAD_DIR

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown node:node .next

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/prisma ./prisma

USER node

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

CMD ["npm", "run", "start"]
