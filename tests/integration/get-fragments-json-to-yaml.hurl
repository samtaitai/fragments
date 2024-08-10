# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a json fragment
Content-Type: application/json
# Include HTTP Basic Auth credentials
[BasicAuth]
test_user1:runInBand1!
# Body of the request goes in ```...``` when it's a string
{
  "user": {
    "name": "Jane Smith",
    "age": 28,
    "email": "jane.smith@example.com",
    "preferences": {
      "theme": "light",
      "notifications": false
    },
    "languages": ["Java", "C++", "Ruby"]
  }
}

# 1. We expect to get back an HTTP 201
HTTP/1.1 201

[Asserts]
jsonpath "$.fragment.type" == "application/json"
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# 2. Try to GET the fragment and convert it to markdown
GET {{url}}.yaml
[BasicAuth]
test_user1:runInBand1!

HTTP/1.1 200
[Asserts]
header "Content-Type" startsWith "application/y"