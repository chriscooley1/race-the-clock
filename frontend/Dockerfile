# Use Node.js 20 as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with verbose logging
RUN npm install --verbose

# If the above fails, try this alternative:
# RUN npm ci --verbose

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Expose the port the app runs on
EXPOSE $PORT

# Start the application
CMD ["npm", "run", "start"]
