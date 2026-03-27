#!/usr/bin/env bash
set -euo pipefail

timestamp=$(date +"%Y%m%d%H%M%S")
mkdir -p releases

notes_file="releases/version-notes-${timestamp}.txt"

# Extract latest changelog entry (first version block)
awk '
  /^## \[/ {if (found) exit; found=1; next}
  found {print}
' CHANGELOG.md > "$notes_file"

echo "Built:"
echo "  Version notes: ${notes_file}"

# Firefox (XPI is just a zip with .xpi extension)
cp manifest.firefox.json manifest.json
version=$(jq -r .version manifest.firefox.json)
filename="releases/github-shortcuts-firefox-${timestamp}-${version}.xpi"
zip -r "${filename}" LICENSE addbuttons.js manifest.json icon.svg >/dev/null
echo "  ${filename}"

# Chrome (upload a .zip to Chrome Web Store)
cp manifest.chrome.json manifest.json
version=$(jq -r .version manifest.chrome.json)
filename="releases/github-shortcuts-chrome-${timestamp}-${version}.zip"
zip -r "${filename}" LICENSE addbuttons.js manifest.json icon.svg >/dev/null
echo "  ${filename}"
