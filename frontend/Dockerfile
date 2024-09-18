# Use the official Node.js image
FROM node:20-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Set up environment variables for build time
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_AUDIENCE

ENV VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN
ENV VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID
ENV VITE_AUTH0_AUDIENCE=$VITE_AUTH0_AUDIENCE

# Run npm build command
RUN npm run build

# Start a new stage for a smaller final image
FROM node:20-alpine

WORKDIR /app

# Copy the built files from the previous stage
COPY --from=build /app/dist ./dist

# Use a lightweight server to serve the built files
RUN npm install -g serve

# Expose port 80
EXPOSE 80

# Serve the built files
CMD ["serve", "-s", "dist", "-l", "80"]
