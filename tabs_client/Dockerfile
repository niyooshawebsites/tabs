# ---------- Build Stage ----------
FROM node:20 AS builder

WORKDIR /app

# Enable corepack
RUN corepack enable

# Copy dependency files
COPY package.json yarn.lock .yarnrc.yml ./

# Install deps (now using node_modules mode)
RUN yarn install --immutable

# Copy project
COPY . .

# Build
RUN yarn build


# ---------- Production Stage ----------
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80