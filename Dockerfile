# Dockerfile for EasyPanel / Dokploy deployment
FROM node:20-alpine AS base

# Install dependencies for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Accept DATABASE_URL from build args (EasyPanel passes env vars as build args)
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/sokeys?schema=public}

# Copy package files
COPY package*.json ./

# Install dependencies (no postinstall)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client and build Next.js app
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install production dependencies (no postinstall now)
RUN npm ci --only=production

# Copy built app and prisma files from base
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=base /app/node_modules/@prisma ./node_modules/@prisma

# Expose port
EXPOSE 3000

# Run migrations and start app
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npm start"]