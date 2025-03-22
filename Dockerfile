# Stage 1: Base image
FROM node:21-alpine AS base

# Set working directory for the application
WORKDIR /home/app

# Expose the application port
EXPOSE 8000

# Stage 2: Build stage
FROM base AS builder

# Set working directory for the build process
WORKDIR /home/build

# Copy package.json and package-lock.json files for better cache management
COPY package*.json ./

# Copy Prisma schema and migrations
COPY prisma/ ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy TypeScript configuration and source files
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY src/ src/

# Build the project
RUN npm run build

# Stage 3: Production-ready runner stage
FROM base AS runner

# Set working directory for the production app
WORKDIR /home/app

# Copy built files from the builder stage
COPY --from=builder /home/build/dist ./dist

# Copy package files from the builder stage
COPY --from=builder /home/build/package*.json ./

# Copy Prisma schema and migrations
COPY --from=builder /home/build/prisma ./prisma

# Copy TypeScript configurations
COPY --from=builder /home/build/tsconfig.json ./
COPY --from=builder /home/build/tsconfig.build.json ./


# Install only production dependencies
RUN npm install --omit=dev

# Ensure tsconfig-paths is available in the final container
RUN npm install tsconfig-paths --save

# Set environment variable to locate tsconfig.json
ENV TS_NODE_PROJECT=/home/app/tsconfig.json

# Start the application
CMD ["node", "run" , "start"]
