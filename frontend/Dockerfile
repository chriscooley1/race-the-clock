# Use the official Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Run npm build command
RUN npm run build

# Use a lightweight server to serve the built files
RUN npm install -g serve

# Serve the built files
CMD ["serve", "-s", "dist", "-l", "80"]
