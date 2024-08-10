# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a html fragment
Content-Type: text/html
# Include HTTP Basic Auth credentials
[BasicAuth]
test_user1:runInBand1!
# Body of the request goes in ```...``` when it's a string
`<h1>this is fragment</h1>`

# 1. We expect to get back an HTTP 201
HTTP/1.1 201

[Asserts]
jsonpath "$.fragment.type" == "text/html"
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# 2. Try to GET the fragment and convert it to markdown
GET {{url}}.md
[BasicAuth]
test_user1:runInBand1!

HTTP/1.1 200
[Asserts]
header "Content-Type" startsWith "text/m"