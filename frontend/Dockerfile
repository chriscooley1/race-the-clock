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

EXPOSE 5173

# Use the development server command with host set to 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
