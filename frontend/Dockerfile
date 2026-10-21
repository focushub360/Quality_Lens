# Stage 1: Build the React app
FROM node:18-alpine AS build
WORKDIR /app

# Copy dependency files first
COPY frontend/package*.json ./
RUN npm ci

# Copy the rest of the frontend source code
COPY frontend/ .

# Build-time environment variables for React
ARG REACT_APP_API_URL=https://api.focusengineeringapp.com
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build the React production static bundle
RUN npm run build

# Stage 2: Serve the React static build with Caddy
FROM caddy:latest
COPY --from=build /app/build /srv/build
COPY Caddyfile /etc/caddy/Caddyfile
