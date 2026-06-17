@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

SET SCRIPT_DIR=%~dp0
SET OUTPUT_DIR=%SCRIPT_DIR%..\..\..\docs\security\trivy

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd-HHmmss"') do set TIMESTAMP=%%i

IF NOT EXIST "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

docker run --rm ^
  -v /var/run/docker.sock:/var/run/docker.sock ^
  -v "%OUTPUT_DIR%:/output" ^
  aquasec/trivy image ^
  --format template ^
  --template "@contrib/html.tpl" ^
  -o "/output/report-frontend-%TIMESTAMP%.html" ^
  scripts-frontend

pause