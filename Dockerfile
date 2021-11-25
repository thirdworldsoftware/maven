FROM node:latest

# Install pnpm
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

# Install ts-node
RUN pnpm install -g ts-node

# Create app directory
WORKDIR /app

# Copy static files to container
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install app dependencies
RUN pnpm install --frozen-lockfile --prod

# Bundle app source
COPY . .

ENV NODE_PATH /app/node_modules

# Start app
CMD ["pnpm", "run", "start:prod"]