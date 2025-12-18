# =========================
# 1) BUILD STAGE
# =========================
FROM php:8.2-cli AS build

WORKDIR /app

# System deps + PHP extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip libpq-dev ca-certificates curl \
  && docker-php-ext-install pdo_pgsql \
  && rm -rf /var/lib/apt/lists/*

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get update && apt-get install -y --no-install-recommends nodejs \
  && rm -rf /var/lib/apt/lists/*

# Composer binary
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy dependency manifests first (better caching)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

COPY package.json package-lock.json ./
RUN npm ci

# Copy app source
COPY . .

# Build frontend (Vite)
RUN npm run build

# IMPORTANT:
# Jangan jalankan php artisan config:cache di sini (build stage),
# karena bisa "mengunci" path/env yang salah.


# =========================
# 2) RUNTIME STAGE
# =========================
FROM php:8.2-cli AS runtime

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev ca-certificates \
  && docker-php-ext-install pdo_pgsql \
  && rm -rf /var/lib/apt/lists/*

# Copy built app from build stage
COPY --from=build /app /app

# Create start script
COPY ./docker/start.sh /start.sh
RUN chmod +x /start.sh

# (Opsional tapi bagus) pakai user non-root
RUN chown -R www-data:www-data /app
USER www-data

ENV APP_ENV=production
ENV APP_DEBUG=false
# KUNCI FIX untuk error kamu:
ENV VIEW_COMPILED_PATH=/app/storage/framework/views

EXPOSE 8080
CMD ["/start.sh"]
