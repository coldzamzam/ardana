#!/bin/sh
set -e

cd /app

mkdir -p storage/framework/cache \
         storage/framework/sessions \
         storage/framework/views \
         storage/logs \
         bootstrap/cache

# JANGAN cache config
php artisan optimize:clear || true

# Pastikan DB siap sebelum migrate
php artisan migrate --force

php artisan serve --host 0.0.0.0 --port ${PORT:-8080}
