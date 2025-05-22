# Use Node.js as the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the frontend dependencies
RUN npm install

# Copy the entire frontend project
COPY . .

# Expose the frontend port (3000)
EXPOSE 3000

# Run the frontend application
CMD ["npm", "start"]
