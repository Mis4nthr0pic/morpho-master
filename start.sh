#!/bin/bash

set -e

MODE=${1:-local}

echo "Morpho Hardcore Training Platform"
echo "================================="

if [ "$MODE" = "docker" ]; then
  echo "Docker mode still uses the legacy compose files and may lag behind local development."
  docker-compose up --build -d
  echo "Open http://localhost:3000 after the container is healthy."
  exit 0
fi

if [ ! -d "node_modules" ]; then
  echo "Dependencies missing. Run npm install first."
  exit 1
fi

echo "Running setup pipeline..."
npm run setup

echo "Starting server on http://localhost:3000"
npm start
