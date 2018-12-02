SHELL := /bin/bash

APP_NAME=go-url
CWD=${shell pwd}/
API_DIR=$(CWD)/api
FRONTEND_DIR=$(CWD)/frontend

install:
	cd $(API_DIR) && \
	dep ensure && \
	cd $(FRONTEND_DIR) && \
	yarn && \
	cd $(CWD)

start-api:
	cd $(API_DIR) && \
	go run server.go

start-frontend:
	cd $(FRONTEND_DIR) && \
	yarn start

build-local:
	cd $(API_DIR) && go build server.go && \
	cd $(FRONTEND_DIR) && yarn build && \
	cd $(CWD) && \
		
build:
	docker build -t $(APP_NAME) .
