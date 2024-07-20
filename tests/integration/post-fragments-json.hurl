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

# 1. We expect to get back an HTTP 201
HTTP/1.1 201
# We have various assertions about the response that we want to check
[Captures]
fragmentId: jsonpath "$.fragment.id"

# 2. Try to GET the fragment we just posted by its URL
GET http://localhost:8080/v1/fragments/{{fragmentId}}
[BasicAuth]
test_user1:runInBand1!

HTTP/1.1 200
[Asserts]
header "Content-Type" startsWith "text/plain"
header "Content-Length" == "19"
body == "This is a fragment!"