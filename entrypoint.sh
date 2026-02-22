#!/bin/sh
set -e

TARGET_DIR="/app/dist"

# Default fallback jika env tidak di-set
API_BASE_URL="${VITE_API_BASE_URL:-http://localhost:8080/api}"
SOCKET_URL="${VITE_SOCKET_URL:-http://localhost:8080}"

echo "🔧 Injecting runtime env..."
echo "   VITE_API_BASE_URL = $API_BASE_URL"
echo "   VITE_SOCKET_URL   = $SOCKET_URL"

# Replace placeholder di semua JS files hasil build
find "$TARGET_DIR" -name "*.js" | while read -r file; do
  sed -i "s|__VITE_API_BASE_URL__|$API_BASE_URL|g" "$file"
  sed -i "s|__VITE_SOCKET_URL__|$SOCKET_URL|g" "$file"
done

echo "✅ Done. Starting server on port 3000..."

exec serve -s dist -l 3000