@echo off
cd ..
docker compose -f scripts/docker-compose.dev.yml ps
pause