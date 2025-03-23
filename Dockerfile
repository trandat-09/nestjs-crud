# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the app files
COPY . .

# Build the app
RUN yarn build

# Expose port (same as in main.ts)
EXPOSE 3000

# Start the application
CMD ["yarn", "start:prod"]
