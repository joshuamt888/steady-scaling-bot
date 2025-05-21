# Use Node.js LTS
FROM node:18

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm install

# Expose port 3000
EXPOSE 3000

# Start the server
CMD ["node", "index.js"]
