@echo off
cd ..
docker compose -f scripts/docker-compose.dev.yml build --no-cache
pause