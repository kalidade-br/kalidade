#!/bin/bash

# Test script to verify Range header support for CheerpJ compatibility
# Usage: ./test-range-support.sh https://your-site.pages.dev

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "======================================"
echo "  Range Header Support Test"
echo "  For CheerpJ Compatibility"
echo "======================================"
echo ""

# Check if URL is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: No URL provided${NC}"
    echo "Usage: $0 <your-deployment-url>"
    echo "Example: $0 https://j2me-player.pages.dev"
    exit 1
fi

URL=$1
JAR_URL="$URL/freej2me-web.jar"

echo "Testing: $JAR_URL"
echo ""

# Test 1: Check if Accept-Ranges header is present
echo "Test 1: Checking Accept-Ranges header..."
ACCEPT_RANGES=$(curl -sI "$JAR_URL" | grep -i "accept-ranges" || echo "")

if [ -z "$ACCEPT_RANGES" ]; then
    echo -e "${RED}❌ FAILED: Accept-Ranges header not found${NC}"
    echo "   CheerpJ will NOT work!"
    echo ""
    echo "   Solutions:"
    echo "   1. Verify web/_headers file exists"
    echo "   2. Redeploy your project"
    echo "   3. Clear Cloudflare cache"
    echo "   4. Wait 1-2 minutes for CDN propagation"
    exit 1
else
    echo -e "${GREEN}✓ PASSED: $ACCEPT_RANGES${NC}"
fi

# Test 2: Try actual Range request
echo ""
echo "Test 2: Testing partial content request..."
HTTP_CODE=$(curl -sI -H "Range: bytes=0-1023" "$JAR_URL" | grep "HTTP" | awk '{print $2}')

if [ "$HTTP_CODE" = "206" ]; then
    echo -e "${GREEN}✓ PASSED: Server supports partial content (HTTP 206)${NC}"
elif [ "$HTTP_CODE" = "200" ]; then
    echo -e "${RED}❌ FAILED: Server returns HTTP 200 instead of 206${NC}"
    echo "   CheerpJ requires HTTP 206 for Range requests!"
    echo ""
    echo "   Fix: Deploy functions/_middleware.js"
    echo "   This file handles Range requests and returns proper 206 responses"
    RANGE_SUPPORT_FAILED=1
else
    echo -e "${RED}❌ FAILED: Unexpected HTTP code: $HTTP_CODE${NC}"
    exit 1
fi

# Test 3: Check Content-Type
echo ""
echo "Test 3: Checking Content-Type..."
CONTENT_TYPE=$(curl -sI "$JAR_URL" | grep -i "content-type" || echo "")

if [ -z "$CONTENT_TYPE" ]; then
    echo -e "${YELLOW}⚠ WARNING: No Content-Type header${NC}"
else
    echo -e "${GREEN}✓ FOUND: $CONTENT_TYPE${NC}"
fi

# Test 4: Check Cache-Control
echo ""
echo "Test 4: Checking Cache-Control..."
CACHE_CONTROL=$(curl -sI "$JAR_URL" | grep -i "cache-control" || echo "")

if [ -z "$CACHE_CONTROL" ]; then
    echo -e "${YELLOW}⚠ WARNING: No Cache-Control header${NC}"
    echo "   Consider adding cache headers for better performance"
else
    echo -e "${GREEN}✓ FOUND: $CACHE_CONTROL${NC}"
fi

# Final summary
echo ""
echo "======================================"
echo "  Summary"
echo "======================================"

if [ ! -z "$ACCEPT_RANGES" ] && ([ "$HTTP_CODE" = "206" ] || [ "$HTTP_CODE" = "200" ]); then
    echo -e "${GREEN}✓ Your deployment should work with CheerpJ!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Visit $URL in your browser"
    echo "2. Hard refresh (Ctrl+Shift+R)"
    echo "3. Upload a JAR file and test"
else
    echo -e "${RED}❌ Your deployment has issues${NC}"
    echo ""
    echo "Fix steps:"
    echo "1. Check that web/_headers file exists"
    echo "2. Redeploy: git commit --allow-empty -m 'Redeploy' && git push"
    echo "3. Wait 1-2 minutes, then test again"
    echo "4. See DEPLOYMENT.md for detailed troubleshooting"
fi

echo ""
