FROM node:18-alpine

WORKDIR /app

# Copy root config
COPY package.json package-lock.json ./
COPY .gitignore ./

# Copy all services (for workspace integrity)
COPY services ./services

# Install dependencies
RUN npm install

# Build shared and service
RUN npm run build --workspace=@capmate/shared
RUN npm run build --workspace=@capmate/listing

# Expose port
EXPOSE 3002

CMD ["node", "services/listing/dist/index.js"]
