#!/bin/sh
set -e

mkdir -p /app/storage/framework/cache \
         /app/storage/framework/sessions \
         /app/storage/framework/views \
         /app/storage/logs \
         /app/bootstrap/cache

if [ -z "$VIEW_COMPILED_PATH" ]; then
  export VIEW_COMPILED_PATH="/app/storage/framework/views"
fi

php artisan optimize:clear || true

php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

php artisan migrate --force || true

# Start server
php artisan serve --host 0.0.0.0 --port ${PORT:-8080}
