#!/usr/bin/env bash
# Set this Worker's secrets on Cloudflare. Prompts for each value (input hidden);
# press Enter to skip one. Run after `npx cf auth login`.
set -euo pipefail
WORKER=datumlabs-aavev3dashboard
for name in NEXT_PUBLIC_THEGRAPH_API_KEY BEEHIIV_API_KEY BEEHIIV_PUBLICATION_ID SETNEL_SECRET; do
  read -r -s -p "$name: " value; echo
  [ -z "$value" ] && { echo "  skipped"; continue; }
  npx cf workers secrets update "$name" --worker "$WORKER" --type secret_text --text "$value" -q >/dev/null && echo "  set"
done
