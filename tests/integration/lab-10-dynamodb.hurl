POST http://localhost:8080/v1/fragments
# We're sending a json fragment
Content-Type: application/json
[BasicAuth]
test_user1:runInBand1!
{ "service": "DynamoDB" }

# 1. We expect to get back an HTTP 201
HTTP/1.1 201
[Asserts]
# 2. The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

# 3-1. Try to GET the fragment meatadata we just posted by its /fragments/:id/info
# "url":"/v1/fragments/e914e78f-8809-4c49-b816-e45893462ae0/info"
GET {{fragment1_url}}/info
[BasicAuth]
test_user1:runInBand1!
# 3-2. Confirm that the server returns a 200, that all of the metadata properties match what you expect
HTTP/1.1 200
[Asserts]
jsonpath "$.fragments[0].id" == {{fragment1_id}}
jsonpath "$.fragments[0].ownerId" exists
jsonpath "$.fragments[0].created" exists
jsonpath "$.fragments[0].updated" exists
jsonpath "$.fragments[0].type" exists
jsonpath "$.fragments[0].size" exists

# 4. POST a second Markdown fragment
POST http://localhost:8080/v1/fragments
# We're sending a markdown fragment
Content-Type: text/markdown
[BasicAuth]
test_user1:runInBand1!
`DynamoDB is **great**`

# 5. We expect to get back an HTTP 201
HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

# 6-1. Try to GET the fragment meatadata we just posted by its /fragments/:id/info
GET {{fragment2_url}}/info
[BasicAuth]
test_user1:runInBand1!
# 6-2. Confirm that the server returns a 200, that all of the metadata properties match what you expect
HTTP/1.1 200
[Asserts]
jsonpath "$.fragments[0].id" == {{fragment2_id}}
jsonpath "$.fragments[0].ownerId" exists
jsonpath "$.fragments[0].created" exists
jsonpath "$.fragments[0].updated" exists
jsonpath "$.fragments[0].type" exists
jsonpath "$.fragments[0].size" exists

# 7-1. GET all of the fragments for the same authorized user without expanding them
GET http://localhost:8080/v1/fragments
[BasicAuth]
test_user1:runInBand1!
HTTP/1.1 200
# 7-2. confirm that the list of fragments includes the two id values you captured above
[Asserts]
jsonpath "$.fragments" includes {{fragment1_id}} 
jsonpath "$.fragments" includes {{fragment2_id}}

# 8. DELETE the first fragment you created above
DELETE {{fragment1_url}}
[BasicAuth]
test_user1:runInBand1!
# 9. Confirm that the server returns a 200.
HTTP/1.1 200
# 7. Try to GET the first fragment again using the url you captured above as the authorized user.
GET {{fragment1_url}}
[BasicAuth]
test_user1:runInBand1!
# 11. Confirm that the server returns a 404, since the fragment should be deleted.
HTTP/1.1 404
# 12-1. GET all of the fragments for the same authorized user without expanding them
GET http://localhost:8080/v1/fragments
[BasicAuth]
test_user1:runInBand1!
HTTP/1.1 200
# 12-2. and confirm that the first id is NOT included but that the second id is
[Asserts]
jsonpath "$.fragments" includes {{fragment2_id}}