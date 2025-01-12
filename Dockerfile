# Use the official Node.js image as the base image
FROM node:20.11-alpine AS base

# Set the working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
# Install necessary packages
RUN apk add --no-cache libc6-compat
# Copy package manager files
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# Install dependencies based on the preferred package manager
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci --legacy-peer-deps; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
# Copy application code
COPY . .
# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
RUN apk add --no-cache tini

# Set environment variables
ENV NODE_ENV=production

# Copy necessary files for production
COPY --from=builder --chown=node /app/next.config.ts ./
COPY --from=builder --chown=node /app/public ./public
COPY --from=builder --chown=node /app/.next/static ./.next/static
COPY --from=builder --chown=node /app/prisma ./prisma
COPY --from=builder --chown=node /app/.next/standalone ./



# Copy only the required node_modules for Prisma
COPY --from=builder --chown=node /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder --chown=node /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=builder --chown=node /app/node_modules/prisma /app/node_modules/prisma



RUN npm install --global --save-exact "prisma@$(node --print 'require("./node_modules/@prisma/client/package.json").version')" && \
    npm install --global --save-exact "ts-node@$(node --print 'require("./package.json").devDependencies["ts-node"]')" && \
    chown -R node:node /usr/local/lib/node_modules/prisma

COPY start.sh /usr/local/bin

ENV CHECKPOINT_DISABLE=1
ENV DISABLE_PRISMA_TELEMETRY=true
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

USER node

ENTRYPOINT [ "start.sh" ]