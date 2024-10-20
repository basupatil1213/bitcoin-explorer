# Use official Node.js image as base
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy the package.json and install dependencies
COPY package*.json ./

# Install dependencies (including next, react, etc.)
RUN npm install

# Copy all the project files to the container
COPY . .

# expose the port where the Next.js app will run
EXPOSE 3000

# Build the Next.js app
RUN npm run build

# Start the Next.js application
CMD ["npm", "run", "start"]
