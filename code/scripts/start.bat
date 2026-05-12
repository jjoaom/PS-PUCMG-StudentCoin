@echo off
cd ..
docker compose -f scripts/docker-compose.dev.yml up
pause