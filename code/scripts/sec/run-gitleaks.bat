@echo off
SET OUTPUT_DIR=%~dp0..\..\..\docs\security\gitleaks

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd-HHmmss"') do set TIMESTAMP=%%i

IF NOT EXIST "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

docker run --rm -v "%CD%:/repo" -v "%OUTPUT_DIR%:/results" zricethezav/gitleaks:v8.30.1 ^
  detect --source=/repo --report-format=json --report-path=/results/gitleaks-report-%TIMESTAMP%.json

pause