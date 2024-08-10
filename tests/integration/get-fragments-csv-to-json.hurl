# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a csv fragment
Content-Type: text/csv
# Include HTTP Basic Auth credentials
[BasicAuth]
test_user1:runInBand1!
# Body of the request goes in ```...``` when it's a string
```
Date,Product,Quantity,Price\n
2024-08-01,Smartphone,5,599.99\n
2024-08-01,Laptop,2,1299.99\n
2024-08-02,Headphones,10,89.99\n
```

# 1. We expect to get back an HTTP 201
HTTP/1.1 201

[Asserts]
jsonpath "$.fragment.type" == "text/csv"
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# 2. Try to GET the fragment and convert it to markdown
GET {{url}}.json
[BasicAuth]
test_user1:runInBand1!

HTTP/1.1 200
[Asserts]
header "Content-Type" startsWith "application/j"