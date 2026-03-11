# Build stage
FROM node:20 AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with clean cache
RUN npm cache clean --force && npm ci --prefer-offline --no-audit --no-fund

# Copy source code
COPY . .

# Show Node and npm versions for debugging
RUN node --version && npm --version

# Build the application for production with increased memory limit
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build:prod

# Production stage
FROM nginx:alpine

# Copy built app to nginx
COPY --from=build /app/dist/incident-web /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
