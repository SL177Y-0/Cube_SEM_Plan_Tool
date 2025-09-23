# Frontend Dockerfile for SEM Plan Tool
FROM node:18-alpine

# Avoid rollup native binary on musl
ENV ROLLUP_SKIP_NODE_NATIVE=1

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (include dev deps for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install serve for production
RUN npm install -g serve

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

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