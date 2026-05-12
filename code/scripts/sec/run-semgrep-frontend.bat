@echo off
SET OUTPUT_DIR=%~dp0..\..\..\Documentacao\security\semgrep

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd-HHmmss"') do set TIMESTAMP=%%i

IF NOT EXIST "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

echo Rodando Semgrep Frontend...

docker run --rm ^
  -v "%~dp0..\..\frontend:/src" ^
  -v "%OUTPUT_DIR%:/results" ^
  returntocorp/semgrep ^
  semgrep scan /src/ ^
    --config=auto ^
    --exclude build ^
    --exclude .dart_tool ^
    --json ^
    --output /results/frontend-semgrep-%TIMESTAMP%.json

pause