# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /webapp

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM node:16-alpine

# Set the working directory
WORKDIR /webapp

# Copy the built application from the builder stage
COPY --from=builder /webapp ./

# Install only production dependencies
RUN npm install --only=production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]