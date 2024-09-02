# Use a specific version of the base image for better cache management
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json ./
COPY yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Use cached dependencies whenever possible
RUN --mount=type=cache,target=/root/.cache \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy necessary files only to optimize cache usage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during the build if needed
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN yarn run build || npm run build || (corepack enable pnpm && pnpm run build)

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Copy built application and required files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Set the correct permissions for the necessary directories
RUN mkdir -p /uploads/banners /uploads/cvs /uploads/avatars /uploads/logos /uploads/attachments \
  && chown -R node:node /app /uploads

USER node

# Install Prisma CLI as a dev dependency to enable usage
RUN npm install --production=false prisma

EXPOSE 3000
ENV PORT=3000

# Start the application
CMD ["node", "server.js"]