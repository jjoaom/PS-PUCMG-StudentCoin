#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUTPUT_DIR="$SCRIPT_DIR/../../docs/security/zap"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")

mkdir -p "$OUTPUT_DIR"

docker run --rm --network host \
  -v "$OUTPUT_DIR:/zap/wrk" \
  ghcr.io/zaproxy/zaproxy:stable \
  zap-api-scan.py \
  -t "http://localhost:8080/v3/api-docs" \
  -f openapi \
  -r zap-report-${TIMESTAMP}.html \
  -J zap-report-${TIMESTAMP}.json