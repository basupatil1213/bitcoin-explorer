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

# Declare arguments for environment variables
ARG DATABASE_URL
ARG DB_USER
ARG DB_HOST
ARG DB_NAME
ARG DB_PASSWORD
ARG DB_PORT
ARG NEXT_PUBLIC_WEBAPP_HOST
ARG ENVIRONMENT

# Set the environment variables
ENV DATABASE_URL=${DATABASE_URL}
ENV DB_USER=${DB_USER}
ENV DB_HOST=${DB_HOST}
ENV DB_NAME=${DB_NAME}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_PORT=${DB_PORT}
ENV NEXT_PUBLIC_WEBAPP_HOST=${NEXT_PUBLIC_WEBAPP_HOST}
ENV ENVIRONMENT=${ENVIRONMENT}

# Expose the port where the Next.js app will run
EXPOSE 3000

# Build the Next.js app
RUN npm run build

# Start the Next.js application
CMD ["npm", "run", "start"]
