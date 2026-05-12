@echo off
cd ..
docker compose -f scripts/docker-compose.dev.yml down -v
docker compose -f scripts/docker-compose.dev.yml up --build
pause