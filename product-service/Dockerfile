# Use a lightweight Node.js environment
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy dependency files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma Client (will silently fail and skip for the api-gateway since it has no Prisma)
RUN npx prisma generate || true

# Build the NestJS application
RUN npm run build

# Start the built application
CMD ["npm", "run", "start:prod"]