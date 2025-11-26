#!/bin/bash

# Script to add CNAME record to Cloudflare for forms.pridehealth.clients.6ps.com
# Usage: ./add-cloudflare-dns.sh <CLOUDFLARE_API_TOKEN> <ZONE_ID>

set -e

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <CLOUDFLARE_API_TOKEN> <ZONE_ID>"
  echo ""
  echo "To get your API token:"
  echo "  1. Go to https://dash.cloudflare.com/profile/api-tokens"
  echo "  2. Create token with 'Edit zone DNS' permissions for 6ps.com"
  echo ""
  echo "To get your Zone ID:"
  echo "  1. Go to Cloudflare Dashboard → Select 6ps.com"
  echo "  2. Scroll down on Overview page to find Zone ID"
  exit 1
fi

API_TOKEN="$1"
ZONE_ID="$2"
DOMAIN="forms.pridehealth.clients.6ps.com"
TARGET="forms-app-ra3fl.ondigitalocean.app"

echo "Adding CNAME record for $DOMAIN → $TARGET..."

RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  --data "{
    \"type\": \"CNAME\",
    \"name\": \"forms.pridehealth.clients\",
    \"content\": \"$TARGET\",
    \"ttl\": 1,
    \"proxied\": true
  }")

SUCCESS=$(echo "$RESPONSE" | grep -o '"success":true' || echo "")

if [ -n "$SUCCESS" ]; then
  echo "✅ DNS record added successfully!"
  echo ""
  echo "Record details:"
  echo "$RESPONSE" | grep -o '"name":"[^"]*"' | head -1
  echo "$RESPONSE" | grep -o '"content":"[^"]*"' | head -1
  echo ""
  echo "DNS propagation may take 1-2 minutes."
else
  echo "❌ Failed to add DNS record"
  echo "Response: $RESPONSE"
  exit 1
fi

