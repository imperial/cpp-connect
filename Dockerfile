# Use a specific version of the base image for better cache management
FROM node:18-alpine AS base
# This sets the base image to node:18-alpine, which is a lightweight version of Node.js 18 based on Alpine Linux.
# Using a specific version helps with reproducibility and cache management.

# Install dependencies only when needed
FROM base AS deps
# This creates a new stage named 'deps' based on the 'base' stage.
RUN apk add --no-cache libc6-compat
# This installs the libc6-compat package without caching the package index, reducing the image size.

WORKDIR /app
# This sets the working directory to /app for subsequent instructions.

# Install dependencies based on the preferred package manager
COPY package.json ./
COPY yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# These lines copy the package.json and any lock files (yarn.lock, package-lock.json, pnpm-lock.yaml) to the working directory.

# Use cached dependencies whenever possible
RUN --mount=type=cache,target=/root/.cache \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi
# This command installs dependencies using the appropriate package manager based on the lock file present.
# The --mount=type=cache,target=/root/.cache option caches the package manager's cache directory to speed up subsequent builds.

# Rebuild the source code only when needed
FROM base AS builder
# This creates a new stage named 'builder' based on the 'base' stage.
WORKDIR /app
# This sets the working directory to /app for subsequent instructions.

# Copy necessary files only to optimize cache usage
COPY --from=deps /app/node_modules ./node_modules
# This copies the node_modules directory from the 'deps' stage to the current working directory.
COPY . .
# This copies the entire application source code to the current working directory.

# Disable telemetry during the build if needed
ENV NEXT_TELEMETRY_DISABLED 1
# This sets an environment variable to disable Next.js telemetry during the build process.

# Build the application
RUN yarn run build || npm run build || (corepack enable pnpm && pnpm run build)
# This runs the build script using yarn, npm, or pnpm, depending on which lock file is present.

# Production image
FROM node:18-alpine AS runner
# This creates a new stage named 'runner' based on the node:18-alpine image.
WORKDIR /app
# This sets the working directory to /app for subsequent instructions.

# Copy built application and required files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
# These lines copy the built application and required files from the 'builder' stage to the current working directory.

# Set the correct permissions for the necessary directories
RUN mkdir -p /uploads/banners /uploads/cvs /uploads/avatars /uploads/logos /uploads/attachments \
  && chown -R node:node /app /uploads
# This creates the necessary upload directories and sets the correct permissions for the /app and /uploads directories.

USER node
# This switches the user to 'node' for running the application.

# Install Prisma CLI as a dev dependency to enable usage
RUN npm install --production=false prisma
# This installs the Prisma CLI as a development dependency.

EXPOSE 3000
# This exposes port 3000 for the application.

ENV PORT=3000
# This sets an environment variable for the application port.

# Start the application
CMD ["node", "server.js"]
# This sets the command to start the application using Node.js to run server.js.