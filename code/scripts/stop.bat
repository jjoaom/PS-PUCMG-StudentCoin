@echo off
cd ..
docker compose -f scripts/docker-compose.dev.yml down
pause