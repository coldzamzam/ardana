# =========================
# BUILD STAGE
# =========================
FROM php:8.2-cli AS build
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip libpq-dev ca-certificates curl \
  && docker-php-ext-install pdo_pgsql \
  && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Node 20 LTS
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get update && apt-get install -y --no-install-recommends nodejs \
  && rm -rf /var/lib/apt/lists/*

# PHP deps
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# JS deps
COPY package.json package-lock.json ./
RUN npm ci

# App source + build assets
COPY . .
RUN npm run build


# =========================
# RUNTIME STAGE
# =========================
FROM php:8.2-cli AS runtime
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev ca-certificates \
  && docker-php-ext-install pdo_pgsql \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app /app

# Start script
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

# Run as non-root (lebih aman)
RUN chown -R www-data:www-data /app
USER www-data

ENV APP_ENV=production
ENV APP_DEBUG=false
ENV PORT=8080

# KUNCI FIX: pastikan compiled view path tidak pernah kosong
ENV VIEW_COMPILED_PATH=/app/storage/framework/views

EXPOSE 8080
CMD ["/start.sh"]
