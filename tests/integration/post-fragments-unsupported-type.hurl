# tests/integration/post-fragments.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: video/ogg
# Include HTTP Basic Auth credentials
[BasicAuth]
test_user1:runInBand1!
# Body of the request goes in ```...``` when it's a string
`This is a fragment image!`

# 1. We expect to get back an HTTP 415
HTTP/1.1 415