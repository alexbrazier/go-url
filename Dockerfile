############################
# Build api
############################
FROM golang:1.11.2-alpine3.8 AS apibuilder
RUN apk update && apk add --no-cache git dep
COPY api $GOPATH/src/github.com/Babylonpartners/go-url/api
WORKDIR $GOPATH/src/github.com/Babylonpartners/go-url/api

# install the dependencies without checking for go code
RUN dep ensure -vendor-only

# Build my app
RUN go build -o /go/bin/server

############################
# Build frontend
############################
FROM node:10.14.0-alpine AS frontendbuilder

COPY frontend /app
WORKDIR /app

RUN yarn --frozen-lockfile && \
    yarn build

############################
# Build actual image
############################
FROM alpine:3.8
# Copy our static executable.
COPY --from=apibuilder /go/bin/server /go/bin/server
COPY --from=frontendbuilder /app/build /go/bin/public
WORKDIR /go/bin
# Run the hello binary.
ENTRYPOINT ["/go/bin/server"]
