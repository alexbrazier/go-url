############################
# Build api
############################
FROM golang:1.12.9-alpine3.10 AS apibuilder
RUN apk update && apk add --no-cache git dep
COPY api $GOPATH/src/github.com/alexbrazier/go-url/api
WORKDIR $GOPATH/src/github.com/alexbrazier/go-url/api

# install the dependencies without checking for go code
RUN dep ensure -vendor-only

# Build my app
RUN go build -o /go/bin/server

############################
# Build frontend
############################
FROM node:10.16.0-alpine AS frontendbuilder

COPY frontend /app
WORKDIR /app

RUN yarn --frozen-lockfile --network-timeout 600000 && \
    yarn build

############################
# Build actual image
############################
FROM alpine:3.10
# Need to get updated certificates to connect to Slack API
RUN apk update && apk add dumb-init ca-certificates && rm -rf /var/cache/apk/*
# Copy our static executable.
COPY --from=apibuilder /go/bin/server /go/bin/server
COPY --from=frontendbuilder /app/build /go/bin/public
WORKDIR /go/bin
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/go/bin/server"]
