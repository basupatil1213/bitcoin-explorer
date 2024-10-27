# Use official Node.js image as base
FROM node:20-alpine

# Install required packages
RUN apk add --no-cache \
    openssl \
    iputils \
    netcat-openbsd \
    ca-certificates

# Set working directory
WORKDIR /usr/src/app

# Copy the package.json and install dependencies
COPY package*.json ./

# Install dependencies (including next, react, etc.)
RUN npm install

# Copy all project files to the container
COPY . .

# Expose the port where the Next.js app will run
EXPOSE 3000

# Build the Next.js app
RUN npm run build

# Start the Next.js application
CMD ["npm", "run", "start"]
