# Fragments

cloud-computing-for-programmers-summer-2024

## Scripts

- ESLint `npm run lint`
- Run server `npm run start`
- Run server via nodemon `npm run dev`
- Run server with debugger `npm run debug`
- Curl with json handling `curl.exe -s http://localhost:8080 | jq`
- Open VSCode in the current dir `code .`
- Docker build `docker build -t fragments:latest .`
- Docker run (test) from Docker Hub image `docker run --rm --name fragments --env-file env.jest -p 8080:8080 samtaitai/fragments:main`
- scp file transfer `scp -i ~/.ssh/ccp555-key-pair.pem .env ec2-user@ec2-3-87-67-207.compute-1.amazonaws.com:`
- npm version update (patch) `npm version patch`
- Trigger CD `git push origin main --tags`
- Entire test (jest) `npm test`
- Single test (jest) `npm test post.test.js`
- Test (jest) coverage `npm run coverage`

