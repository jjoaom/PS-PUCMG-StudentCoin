@echo off
SET SCRIPT_DIR=%~dp0
SET OUTPUT_DIR=%SCRIPT_DIR%..\..\..\Documentacao\security\checkov

IF NOT EXIST "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

REM Gerar timestamp antes de rodar
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd-HHmmss"') do set TIMESTAMP=%%i

REM Rodar Checkov redirecionando stdout direto pro arquivo final
docker run --rm ^
  -v "%SCRIPT_DIR%..\..:/src" ^
  -v "%OUTPUT_DIR%:/results" ^
  bridgecrew/checkov ^
  -d /src -o json > "%OUTPUT_DIR%\checkov-report-%TIMESTAMP%.json"

echo Relatorio salvo em %OUTPUT_DIR%\checkov-report-%TIMESTAMP%.json
pause