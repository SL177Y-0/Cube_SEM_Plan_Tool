# Frontend Dockerfile for SEM Plan Tool
FROM node:18-bullseye-slim

# Avoid rollup native binary
ENV ROLLUP_SKIP_NODE_NATIVE=1
ENV NODE_ENV=production

# Install curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (include dev deps for build) without optional native bins
RUN npm ci --no-optional

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install serve for production
RUN npm install -g serve

# Create non-root user
RUN groupadd -g 1001 nodejs && useradd -m -u 1001 -g nodejs nextjs

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]