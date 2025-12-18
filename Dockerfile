# ---- Base: PHP 8.2 CLI  ----
FROM php:8.2-cli AS base

# System deps + PHP extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip libpq-dev ca-certificates curl \
 && docker-php-ext-install pdo_pgsql \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ---- Node for building assets ----
FROM base AS build

# Install Node (LTS) via Nodesource
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
 && apt-get update && apt-get install -y --no-install-recommends nodejs \
 && rm -rf /var/lib/apt/lists/*

# Copy only dependency manifests first
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the app
COPY . .

# Build frontend assets
RUN npm run build

# Laravel caches
RUN php artisan config:cache || true \
 && php artisan route:cache || true \
 && php artisan view:cache || true

# ---- Runtime image ----
FROM base AS runtime

# Copy built app from build stage
COPY --from=build /app /app

# Railway provides PORT; default to 8080
ENV PORT=8080

# Start script: migrate safely, then serve
CMD php artisan migrate --force && php artisan db:seed --force && php artisan serve --host 0.0.0.0 --port ${PORT}
