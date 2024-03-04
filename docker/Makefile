#!make
PROJECT_NAME                := hls-player
BASENAME_SERVER             := ${PROJECT_NAME}-server
BASENAME_PROXY              := ${PROJECT_NAME}-proxy
NAME_SERVER                 := ${BASENAME_SERVER}-$$env
NAME_PROXY                  := ${BASENAME_PROXY}-$$env
IMG_LATEST_SERVER     		  := ${NAME_SERVER}:latest
IMG_LATEST_PROXY     		    := ${NAME_PROXY}:latest

build:
	@docker build -f _proxy.Dockerfile --build-arg ENV=$$env -t ${IMG_LATEST_PROXY} ./;
	@docker build -f _server.Dockerfile --build-arg ENV=$$env -t ${IMG_LATEST_SERVER} ../;

run:
	@echo $$env;
	@docker-compose -f docker-compose-$$env.yaml -p ${PROJECT_NAME}-server-$$env down 
	@docker-compose -f docker-compose-$$env.yaml -p ${PROJECT_NAME}-server-$$env up -d
	# @docker logs -f ${PROJECT_NAME}-server-$$env

network:
	@sh create-network.sh

kill:
	@echo 'Killing container...'
	@docker-compose -f docker-compose-$$env.yaml -p ${PROJECT_NAME}-server-$$env down