# Base (PHP + extensions)
FROM php:8.2-cli AS base

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip libpq-dev ca-certificates curl \
  && docker-php-ext-install pdo_pgsql \
  && rm -rf /var/lib/apt/lists/*

# Composer binary
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Build (install deps + build assets)
FROM base AS build

# Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get update && apt-get install -y --no-install-recommends nodejs \
  && rm -rf /var/lib/apt/lists/*

# PHP deps first
COPY composer.json composer.lock ./
# IMPORTANT: artisan belum ada di tahap ini, jadi jangan jalankan scripts dulu
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# JS deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy full app source
COPY . .

# Laravel dirs + permissions
RUN mkdir -p storage/framework/{cache,sessions,views} \
 && mkdir -p bootstrap/cache \
 && chmod -R 775 storage bootstrap/cache

# Build
RUN composer dump-autoload --optimize \
 && php artisan package:discover --ansi \
 && npm run build \
 && php artisan config:cache || true \
 && php artisan route:cache || true \
 && php artisan view:cache || true


# Runtime
FROM base AS runtime

WORKDIR /app
COPY --from=build /app /app

# Safety: ensure writable on runtime too
RUN mkdir -p storage/framework/{cache,sessions,views} \
 && mkdir -p bootstrap/cache \
 && chmod -R 775 storage bootstrap/cache

ENV PORT=8080

# Start: migrate safely (NO fresh), then serve
CMD sh -lc "php artisan migrate --force && php artisan serve --host 0.0.0.0 --port ${PORT}"
