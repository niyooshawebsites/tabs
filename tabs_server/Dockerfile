# 1. Use official Node image
FROM node:22

# 2. Create working directory inside container
WORKDIR /app

# 3. Copy package.json first
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy all remaining files
COPY . .

# 6. Expose server port
EXPOSE 8800

# 7. Start the server
# CMD ["node", "server.js"]
CMD ["npm", "run", "dev"]
