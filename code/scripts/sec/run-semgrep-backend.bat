@echo off

SET OUTPUT_DIR=%~dp0..\..\..\docs\security\semgrep

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd-HHmmss"') do set TIMESTAMP=%%i

IF NOT EXIST "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

echo Rodando Semgrep Backend...

docker run --rm ^
  -v "%~dp0..\..\backend:/src" ^
  -v "%OUTPUT_DIR%:/results" ^
  returntocorp/semgrep ^
  semgrep scan /src/ ^
    --config=p/java ^
    --config=p/security-audit ^
    --config=p/owasp-top-ten ^
    --exclude build ^
    --exclude .gradle ^
    --exclude gradlew ^
    --json ^
    --output /results/backend-semgrep-%TIMESTAMP%.json

pause