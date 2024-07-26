POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
[BasicAuth]
test_user1:runInBand1!
`Hello S3!`

# 1. We expect to get back an HTTP 201
HTTP/1.1 201
[Asserts]
# 2. The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
[Captures]
url: header "Location"

# 3. Try to GET the fragment we just posted by its URL
GET {{url}}
[BasicAuth]
test_user1:runInBand1!
# 4. Confirm that the server returns a 200, that the type of the fragment is text/plain, and that the body is equal to Hello S3!
HTTP/1.1 200
[Asserts]
header "Content-Type" startsWith "text/plain"
body == "Hello S3!"

# 5. DELETE the fragment using the url as an authorized user.
DELETE {{url}}
[BasicAuth]
test_user1:runInBand1!
# 6. Confirm that the server returns a 200.
HTTP/1.1 200
# 7. Try to GET the fragment again using the url as an authorized user.
GET {{url}}
[BasicAuth]
test_user1:runInBand1!
# 8. Confirm that the server returns a 404, since the fragment should be deleted.
HTTP/1.1 404