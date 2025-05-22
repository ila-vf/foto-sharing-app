# Use Node.js as the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire backend project
COPY . .

# Install netcat untuk cek koneksi TCP (dibutuhkan skrip wait-for-db.sh)
RUN apt-get update && apt-get install -y netcat-openbsd

# Expose the backend port
EXPOSE 5000

# Jalankan skrip yang menunggu DB sebelum mulai backend
CMD ["sh", "./wait-for-db.sh"]
