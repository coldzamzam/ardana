#!/bin/sh
set -e

cd /app

# Ensure required Laravel dirs exist
mkdir -p storage/framework/cache \
         storage/framework/sessions \
         storage/framework/views \
         storage/logs \
         bootstrap/cache

# Guarantee compiled path is valid (covers "set but empty" cases)
if [ -z "$VIEW_COMPILED_PATH" ]; then
  export VIEW_COMPILED_PATH="/app/storage/framework/views"
fi

# Clear any cached config that might have locked a bad/empty path
php artisan optimize:clear || true

# Rebuild caches (optional; safe)
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Migrate safely (NO fresh in prod)
php artisan migrate --force || true

# Start server
php artisan serve --host 0.0.0.0 --port ${PORT:-8080}
