# --- base ---
FROM php:8.2-cli AS base
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip libpq-dev ca-certificates curl \
  && docker-php-ext-install pdo_pgsql \
  && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# install node
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get update && apt-get install -y --no-install-recommends nodejs \
  && rm -rf /var/lib/apt/lists/*


# --- build ---
FROM base AS build

# 1) composer deps (tanpa scripts, karena artisan belum ada)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# 2) node deps
COPY package.json package-lock.json ./
RUN npm ci

# 3) baru copy seluruh project (termasuk artisan)
COPY . .

# 4) sekarang aman jalankan composer scripts / discovery + build assets
RUN composer dump-autoload --optimize \
  && php artisan package:discover --ansi \
  && npm run build \
  && php artisan config:cache || true \
  && php artisan route:cache || true \
  && php artisan view:cache || true


# --- runtime ---
FROM base AS runtime
COPY --from=build /app /app

EXPOSE 8080
CMD sh -lc "php artisan migrate --force || true && php artisan serve --host 0.0.0.0 --port ${PORT:-8080}"
