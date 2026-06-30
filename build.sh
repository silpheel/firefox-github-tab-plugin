#!/usr/bin/env bash
set -euo pipefail

PUBLISH=0
TAG=""

for arg in "$@"; do
  case $arg in
    --yes)
      PUBLISH=1
      ;;
    -y)
      PUBLISH=1
      ;;
    --tag=*)
      TAG="${arg#*=}"
      ;;
  esac
done

timestamp=$(date +"%Y%m%d%H%M%S")
mkdir -p releases

notes_file="releases/version-notes-${timestamp}.txt"

awk '
  /^## \[/ {if (found) exit; found=1; next}
  found {print}
' CHANGELOG.md > "$notes_file"

echo "Built:"
echo "  Version notes: ${notes_file}"

# Firefox
cp manifest.firefox.json manifest.json
firefox_version=$(jq -r .version manifest.firefox.json)
firefox_file="releases/github-shortcuts-firefox-${timestamp}-${firefox_version}.xpi"
zip -r "${firefox_file}" LICENSE addbuttons.js manifest.json icon.svg >/dev/null
echo "  ${firefox_file}"

# Chrome
cp manifest.chrome.json manifest.json
chrome_version=$(jq -r .version manifest.chrome.json)
chrome_file="releases/github-shortcuts-chrome-${timestamp}-${chrome_version}.zip"
zip -r "${chrome_file}" LICENSE addbuttons.js manifest.json icon.svg >/dev/null
echo "  ${chrome_file}"

if [ -z "$TAG" ]; then
  TAG="v${firefox_version}"
fi

if [ "$PUBLISH" -eq 0 ]; then
  read -p "Publish release $TAG? [y/N] " confirm
  if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    exit 0
  fi
done

echo "Creating GitHub release ${TAG}..."
gh release create "$TAG" \
  --draft \
  --fail-on-no-commits \
  "$firefox_file" \
  "$chrome_file" \
  -F "$notes_file" \
  -t "$TAG"
