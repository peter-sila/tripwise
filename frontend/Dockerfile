FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Expose port (3000 for Create React App, 5173 for Vite)
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]
