FROM node:18-alpine

WORKDIR /app

# Copy root config
COPY package.json package-lock.json ./
COPY .gitignore ./

# Copy all services (for workspace integrity)
COPY services ./services

# Copy mobile (for workspace integrity)
COPY mobile ./mobile

# Install dependencies (including shared)
RUN npm install

# Build shared and service
RUN npm run build --workspace=@capmate/shared
RUN npm run build --workspace=@capmate/auth

# Expose port
EXPOSE 3001

CMD ["node", "services/auth/dist/index.js"]
