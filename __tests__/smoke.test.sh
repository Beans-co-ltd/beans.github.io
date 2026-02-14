#!/bin/bash
# Smoke test: start a local server and verify the page loads correctly
set -e

PORT=8080
SERVER_PID=""

cleanup() {
  if [ -n "$SERVER_PID" ]; then
    kill "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

echo "Starting local server on port $PORT..."
npx http-server . -p "$PORT" -s &
SERVER_PID=$!

# Wait for server to be ready
echo "Waiting for server..."
for i in $(seq 1 30); do
  if curl -s -o /dev/null "http://localhost:$PORT" 2>/dev/null; then
    echo "Server is ready."
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "FAIL: Server did not start within 30 seconds."
    exit 1
  fi
  sleep 1
done

PASS=0
FAIL=0

check() {
  local description="$1"
  local result="$2"
  if [ "$result" -eq 0 ]; then
    echo "  PASS: $description"
    PASS=$((PASS + 1))
  else
    echo "  FAIL: $description"
    FAIL=$((FAIL + 1))
  fi
}

# Fetch the page
echo ""
echo "Fetching http://localhost:$PORT ..."
HTTP_CODE=$(curl -s -o /tmp/smoke-test-body.html -w "%{http_code}" "http://localhost:$PORT")
BODY=$(cat /tmp/smoke-test-body.html)

echo "HTTP status: $HTTP_CODE"
echo ""
echo "Running checks..."

# 1. HTTP 200
[ "$HTTP_CODE" = "200" ]
check "HTTP status is 200" $?

# 2. Has DOCTYPE
echo "$BODY" | head -1 | grep -qi "doctype"
check "Has DOCTYPE declaration" $?

# 3. Has title
echo "$BODY" | grep -q "<title>"
check "Has <title> tag" $?

# 4. Key sections exist
echo "$BODY" | grep -q 'id="car-collection"'
check "Has car-collection section" $?

echo "$BODY" | grep -q 'id="order-sales"'
check "Has order-sales section" $?

echo "$BODY" | grep -q 'id="support"'
check "Has support section" $?

echo "$BODY" | grep -q 'id="shop"'
check "Has shop section" $?

echo "$BODY" | grep -q 'id="company-info"'
check "Has company-info section" $?

# 5. Company info present
echo "$BODY" | grep -q "株式会社Beans"
check "Has company name" $?

echo "$BODY" | grep -q "0154-64-1696"
check "Has phone number" $?

# 6. CSS and JS loaded
CSS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/style.css")
[ "$CSS_CODE" = "200" ]
check "style.css returns 200" $?

JS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/script.js")
[ "$JS_CODE" = "200" ]
check "script.js returns 200" $?

# 7. Images accessible
FAVICON_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/assets/images/favicon.png")
[ "$FAVICON_CODE" = "200" ]
check "favicon.png is accessible" $?

LOGO_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/assets/images/logo.png")
[ "$LOGO_CODE" = "200" ]
check "logo.png is accessible" $?

# Summary
echo ""
echo "Results: $PASS passed, $FAIL failed"
if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
echo "All smoke tests passed!"
