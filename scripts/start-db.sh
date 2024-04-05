#!/bin/bash

# Author: Joydeep

set -e

DB_IMAGE_NAME="mongo:6-jammy"
DB_SERVICE_NAME="near-streamer-1-db"
DB_VOLUME_PATH="./db-alpha"
ENV_PATH="$(pwd)/.env"

service_exists() {
    docker service ls | grep -q "$1"
}

validate_dir_path() {
    if [ ! -d "$1" ]; then
        echo "$1 directory not found. Please create and retry."
        exit 1
    fi
}

validate_file_path() {
    if [ ! -f "$1" ]; then
        echo "$1 file not found. Please create and retry."
        exit 1
    fi
}

if validate_file_path "$ENV_PATH"; then
    echo "ENV file found"
fi

if service_exists $DB_SERVICE_NAME; then
    echo "Removing existing $DB_SERVICE_NAME service..."
    docker service rm $DB_SERVICE_NAME
fi

echo "Creating $DB_SERVICE_NAME service"
docker service create \
    --name $DB_SERVICE_NAME \
    --restart-condition on-failure \
    --restart-delay 10s \
    --limit-cpu 2 \
    --restart-max-attempts 5 \
    --env-file "$ENV_PATH" \
    -p 27018:27018 \
    --mount type=volume,source="$DB_VOLUME_PATH",target=/data/db \
    $DB_IMAGE_NAME

echo "$DB_SERVICE_NAME service created successfully."