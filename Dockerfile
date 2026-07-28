FROM node:20-alpine

WORKDIR /usr/src/myapp

# update and install dependency
RUN apk add --no-cache git

COPY package.json package-lock.json ./
RUN npm ci

COPY . .


# Assign ENV variables
# Bind the App to any IP
ENV NODE_ENV=production
ENV NITRO_PORT=3004
ENV NITRO_HOST=0.0.0.0
# ENV STRAPI_BASEURL=STRAPI_BASEURL

# Build the production Version of the Application
RUN npm run build


# Expose the Port Outside the container to the localhost
EXPOSE 3000

# Run Command after building the container
ENTRYPOINT [ "node", ".output/server/index.mjs" ]
# CMD [ "yarn", "run", "dev" ]  # Use CMD for running the app