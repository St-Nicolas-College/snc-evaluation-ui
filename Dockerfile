FROM node:20-alpine

WORKDIR /usr/src/myapp

# Install git if needed by dependencies
RUN apk add --no-cache git

COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

COPY . .

# Production Environment
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3004

# Build Nuxt
RUN npm run build

# Expose Nitro Port
EXPOSE 3004

# Start Nuxt
CMD ["node", ".output/server/index.mjs"]