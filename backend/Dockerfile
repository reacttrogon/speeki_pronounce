# Use Node.js 18 (matches your engines requirement)
FROM node:18-alpine

# Install FFmpeg (this fixes your "Cannot find ffmpeg" error)
RUN apk add --no-cache ffmpeg

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Create uploads directory (for audio files)
RUN mkdir -p uploads

# Copy your server code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expose port (your server runs on port from env or 3000)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the server
CMD ["npm", "start"]