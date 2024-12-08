# Use Node.js 20 as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install all dependencies with overrides for deep-equal
RUN npm install --legacy-peer-deps && \
    npm install uuid @types/uuid @hello-pangea/dnd react-icons && \
    npm install @gilbarbara/deep-equal@0.3.1 --save-exact

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Expose the port the app runs on
EXPOSE 80

# Start the application
CMD ["npm", "run", "start"]
