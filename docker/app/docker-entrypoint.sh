#!/bin/sh

set -e

cron

if [ "${1#-}" != "$1" ]; then
        set -- php-fpm7 "$@"
fi

exec "$@"

source .env