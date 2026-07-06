#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

mkdir -p output

tippecanoe \
  --output=output/zcta.pmtiles \
  --layer=zctas \
  --minimum-zoom=0 \
  --maximum-zoom=9 \
  --simplification=10 \
  --coalesce-densest-as-needed \
  --extend-zooms-if-still-dropping \
  --force \
  intermediate/zcta_joined.geojsonl

ls -la output/zcta.pmtiles
