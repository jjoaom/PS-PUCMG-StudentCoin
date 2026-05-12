@echo off
SET OUTPUT_DIR=%~dp0..\..\..\Documentacao\security\trivy

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd-HHmmss"') do set TIMESTAMP=%%i

IF NOT EXIST "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

docker run --rm -v "%CD%:/src" -v "%OUTPUT_DIR%:/results" aquasec/trivy ^
  fs /src --format json --output /results/trivy-report-%TIMESTAMP%.json

pause