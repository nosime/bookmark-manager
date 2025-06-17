# ============================================================================
# DOCKERFILE - Using ARGs for Secret Keys
# Build-time: ARG cho secret keys, Runtime: ENV từ container
# ============================================================================

FROM node:22-alpine

# Build arguments cho secret keys (pass từ --build-arg)
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY

# Install system dependencies
RUN apk add --no-cache \
    libc6-compat \
    curl \
    bash

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies với legacy peer deps
RUN npm ci --legacy-peer-deps

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Set build environment với settings cố định
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Set build-time Clerk URLs (settings cố định)
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Set build-time APP URL (có thể override tại runtime)
ENV NEXT_PUBLIC_APP_URL=http://localhost:3000

# Build application với ARG keys
RUN NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} \
    CLERK_SECRET_KEY=${CLERK_SECRET_KEY} \
    npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
# Runtime environment variables sẽ được inject khi run container
CMD ["npm", "start"]