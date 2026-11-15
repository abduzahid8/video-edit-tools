#!/bin/bash
set -e
cd "$(dirname "$0")"
if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 is needed. Install from https://www.python.org/downloads/"; read -r -p "Press Enter to close..."; exit 1
fi
python3 download_photos.py
printf "\nPress Enter to close..."
read -r
