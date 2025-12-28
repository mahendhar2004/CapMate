FROM node:18-alpine

WORKDIR /app

# Copy root config
COPY package.json package-lock.json ./
COPY .gitignore ./

# Copy all services (for workspace integrity)
COPY services ./services

# Copy mobile (for workspace integrity)
COPY mobile ./mobile

# Install dependencies
RUN npm install --include=dev

# Build shared and service
RUN npm run build --workspace=@capmate/shared
RUN npm run build --workspace=@capmate/payment

# Expose port
EXPOSE 3003

CMD ["node", "services/payment/dist/index.js"]
