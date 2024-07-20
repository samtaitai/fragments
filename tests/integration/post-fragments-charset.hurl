# tests/integration/post-fragments.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
# Include HTTP Basic Auth credentials
[BasicAuth]
test_user1:runInBand1!
# Body of the request goes in ```...``` when it's a string
`This is a fragment!`

HTTP/1.1 201
# We have various assertions about the response that we want to check
[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
test_user1:runInBand1!

HTTP/1.1 200
[Asserts]
header "Content-Type" contains "charset"