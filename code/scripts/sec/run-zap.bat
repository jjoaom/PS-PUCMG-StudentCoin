@echo off
SET OUTPUT_DIR=%~dp0..\..\..\docs\security\zap

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd-HHmmss"') do set TIMESTAMP=%%i

IF NOT EXIST "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

docker run --rm --network host ^
  -v "%OUTPUT_DIR%:/zap/wrk" ^
  ghcr.io/zaproxy/zaproxy:stable ^
  zap-api-scan.py ^
  -t "http://localhost:8080/v3/api-docs" ^
  -f openapi ^
  -r zap-report-%TIMESTAMP%.html ^
  -J zap-report-%TIMESTAMP%.json

pause