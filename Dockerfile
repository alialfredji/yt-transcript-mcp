# Use Node.js 20 slim image for smaller size
FROM node:20-slim

# Install Python 3 (required for yt-dlp)
RUN apt-get update && \
    apt-get install -y python3 python3-pip ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Build TypeScript
RUN npm install typescript && \
    npm run build && \
    npm uninstall typescript

# Copy bundled yt-dlp binary
COPY yt-dlp /app/yt-dlp
RUN chmod +x /app/yt-dlp

# Expose port (default 3000, configurable via PORT env var)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000) + '/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Run in HTTP mode
CMD ["node", "dist/index.js", "--http"]
