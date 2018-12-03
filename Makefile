SHELL := /bin/bash

APP_NAME=go-url
COMMIT_ID=$(shell git rev-parse HEAD)
SEMVER_VERSION=$(shell cat VERSION)
CWD=${shell pwd}/
API_DIR=$(CWD)/api
FRONTEND_DIR=$(CWD)/frontend
REPO=quay.io/babylonhealth
DEPLOY_DEV_URL=http://dev-ai-deploy.babylontech.co.uk:5199/job/kube-deploy-dev/buildWithParameters
DEPLOY_STAGING_URL=http://dev-ai-deploy.babylontech.co.uk:5199/job/kube-deploy-staging/buildWithParameters

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
	docker build \
		--label application=$(APP_NAME) \
		--label version=$(SEMVER_VERSION) \
		--label commit_id=$(COMMIT_ID) \
		-t $(REPO)/$(APP_NAME):$(COMMIT_ID) .
		# mkdir -p docker-cache && \
		# docker save -o docker-cache/$(APP_NAME).tar $(REPO)/$(APP_NAME):$(COMMIT_ID)

tag-master: build
	docker tag $(REPO)/$(APP_NAME):$(COMMIT_ID) $(REPO)/$(APP_NAME):master
	docker tag $(REPO)/$(APP_NAME):$(COMMIT_ID) $(REPO)/$(APP_NAME):$(COMMIT_ID)
	docker push $(REPO)/$(APP_NAME):master
	docker push $(REPO)/$(APP_NAME):$(COMMIT_ID)

tag-semver: build
	@if docker run -e DOCKER_REPO=babylonhealth/$(APP_NAME) -e DOCKER_TAG=$(SEMVER_VERSION) quay.io/babylonhealth/tag-exists; \
	  then echo "Tag $(SEMVER_VERSION) already exists!" && exit 0 ; \
	else \
	  docker tag $(REPO)/$(APP_NAME):$(COMMIT_ID) $(REPO)/$(APP_NAME):$(SEMVER_VERSION); \
	  docker push $(REPO)/$(APP_NAME):$(SEMVER_VERSION); \
	fi

test: tag-master
	docker run -d -t $(REPO)/$(APP_NAME):$(COMMIT_ID)

deploy-dev:
	@curl -vvv --fail -XPOST "${DEPLOY_DEV_URL}?token=${JENKINS_DEV_TOKEN}&APP=${APP_NAME}&VERSION=${COMMIT_ID}"

deploy-staging:
	@curl -vvv --fail -XPOST "${DEPLOY_STAGING_URL}?token=${JENKINS_STAGING_TOKEN}&APP=${APP_NAME}&VERSION=${SEMVER_VERSION}"
