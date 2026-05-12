@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

SET SCRIPT_DIR=%~dp0
SET COMPOSE_FILE=%SCRIPT_DIR%..\docker-compose.dev.yml
SET OUTPUT_DIR=%SCRIPT_DIR%..\..\..\Documentacao\security\nuclei
SET TARGET=http://localhost:8080

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd-HHmmss"') do set TIMESTAMP=%%i
SET REPORT=%OUTPUT_DIR%\nuclei-report-%TIMESTAMP%.json

IF NOT EXIST "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

echo [1/4] Subindo aplicacao...
docker compose -f "%COMPOSE_FILE%" up -d
IF ERRORLEVEL 1 (
    echo ERRO: Falha ao subir o compose.
    exit /b 1
)

echo [2/4] Aguardando backend em %TARGET%...
SET /A TRIES=0
:WAIT_LOOP
SET /A TRIES+=1
IF %TRIES% GTR 60 (
    echo ERRO: Backend nao respondeu apos 3 minutos.
    goto TEARDOWN
)
powershell -NoProfile -Command ^
  "try { $r = Invoke-WebRequest -Uri '%TARGET%/actuator/health' -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } } catch { } exit 1" >nul 2>&1
IF ERRORLEVEL 1 (
    echo Tentativa %TRIES%/60 - aguardando 3s...
    timeout /t 3 /nobreak >nul
    goto WAIT_LOOP
)
echo Backend disponivel!

echo [3/4] Rodando Nuclei...
docker run --rm --network host ^
  -v "%OUTPUT_DIR%:/results" ^
  projectdiscovery/nuclei ^
  -u %TARGET% ^
  -tags spring,actuator,exposure,misconfig,cve ^
  -severity medium,high,critical ^
  -je /results/nuclei-report-%TIMESTAMP%.json

echo Relatorio salvo em %REPORT%

:TEARDOWN
echo [4/4] Derrubando containers...
docker compose -f "%COMPOSE_FILE%" down

echo Concluido.
pause