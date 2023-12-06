#!/bin/bash

FLAG="/usr/migrator/migration_done.flag"

if [ ! -f "$FLAG" ]; then
    echo "Flag file not found. Running migrations."
    npx prisma migrate dev --name init
    touch "$FLAG"
else
    echo "Migrations have already been run."
fi
