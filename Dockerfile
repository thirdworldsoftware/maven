FROM node:latest

# Install pnpm
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

# Create app directory
WORKDIR /app

# Copy static files to container
COPY package.json /app
COPY pnpm-lock.yaml /app
COPY prisma /app/prisma/

# Install app dependencies
RUN pnpm install --frozen-lockfile

# Bundle app source
COPY . .

ENV NODE_PATH /app/node_modules

# Start app
CMD ["pnpm", "run", "start:prod"]