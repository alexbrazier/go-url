# Go URL

A simple URL shortener written in Go with a React frontend and Postgres database

# Features

- Shorten urls based on a user defined key
- Alias a key to point to another short url
- Open multiple pages at once by separating keys with a comma
- Alias a key to point to multiple other keys
- Opensearch integration to provide suggestions directly to browser
- Frontend to view most popular searches and search to find existing links
- Frontend to allow anyone to add and edit links
- Optional authentication using Azure AD

# Getting Started

The app uses Makefiles. To build the docker image run `make build`.

Before starting the app for the first time run `make install`, then:
- To start the api run `make start-api`.
- To start the frontend run `make start-frontend`


## Enviroment Configuration

### Authentication
```bash
# Enable Azure auth or not - if enabled, all other fields must be filled in
ENABLE_AUTH=false
# These come from the Azure AD dashboard
AD_TENANT_ID=
AD_CLIENT_ID=
AD_CLIENT_SECRET=
# Secret session token to store the user sessions
SESSION_TOKEN=
```

### Other
```bash
PORT=1323
DEBUG=false
JSON_LOGS=false
POSTGRES_ADDR=localhost:5432
POSTGRES_DATABASE=go
POSTGRES_USER=
POSTGRES_PASS=
```
