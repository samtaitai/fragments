# Fragments API Server

This repository contains the API server for the Fragments application. It provides endpoints for creating, reading, updating, and deleting fragments, as well as converting fragments between different formats.

## Features

- Fragments Metadata stored in Amazon DynamoDB
- Fragments Data stored in Amazon S3
- Configurable data model (`MemoryDB` or AWS S3/DynamoDB) via `.env`
- Support for creating text, image, and JSON fragments
- Update and delete functionality for authenticated users' fragments
- Fragment type conversion with support for various formats
- Automatic Docker image build and push to Amazon ECR
- Automatic deployment to Elastic Container Service (ECS)
![System Architecture Diagram](https://github.com/samtaitai/fragments/blob/main/mermaid-diagram-2024-08-12-095421.png)

## Technologies Used

- Node.js
- Express.js
- Amazon DynamoDB
- Amazon S3
- Docker
- GitHub Actions
- Amazon Elastic Container Registry (ECR)
- Amazon Elastic Container Service (ECS)
- Jest
- Hurl
- Markdown-it (for html conversions)
- Turndown (for markdown conversion)
- Papaparse (for json conversions)
- Sharp (for image conversions)

## Prerequisites

- Node.js and npm installed
- Docker installed
- AWS account with necessary permissions
- GitHub account

## API Endpoints

- `POST /fragments`: Create a new fragment
- `GET /fragments`: Get all fragments for the authenticated user
- `GET /fragments/:id`: Get a specific fragment
- `PUT /fragments/:id`: Update an existing fragment
- `DELETE /fragments/:id`: Delete an existing fragment
- `GET /fragments/:id.ext`: Get a fragment converted to a specific format

## Continuous Deployment

This repository is set up with GitHub Actions for continuous deployment:

1. On every new git tag, a Docker image is automatically built and pushed to Amazon ECR.
2. The Docker container is then automatically deployed to ECS using the pre-built ECR image.

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
- Unit Test (jest) coverage `npm run coverage`
- Integration Test (Hurl) `npm run test:integration`
- Create dev environment `docker compose up --build -d`
- Set up local DB for dev environment `./scripts/local-aws-setup.sh`

