FROM node:18-alpine

WORKDIR /app

# Copy root config
COPY package.json package-lock.json ./
COPY .gitignore ./

# Copy shared workspace
COPY services/shared ./services/shared

# Copy service
COPY services/auth ./services/auth

# Install dependencies (including shared)
RUN npm install

# Build shared and service
RUN npm run build --workspace=@capmate/shared
RUN npm run build --workspace=@capmate/auth

# Expose port
EXPOSE 3001

CMD ["node", "services/auth/dist/index.js"]
