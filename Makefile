IMAGE_NAME := react-docker-app_web
IMAGE_TAG := latest
CONTAINER_NAME := game
ENV_FILE_NAME := SPACE_ENV
PORT_NO := 8080

mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
current_dir := $(notdir $(patsubst %/,%,$(dir $(mkfile_path))))

MAKE_DIR := $(strip $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST)))))

ifndef ${ENV_FILE_NAME}
	ifeq ($(shell test -s ./env && echo -n yes),yes)
		ENV_FILE := $(abspath ./env)
	else
		ENV_FILE := /dev/null
	endif
else
	ENV_FILE := ${${ENV_FILE_NAME}}
endif

.PHONY: all start build clean create kill shell logs status docker_ip

all: create status

start:
	docker start $(CONTAINER_NAME)

build:
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

clean:
	docker images $(IMAGE_NAME) | grep -q $(IMAGE_TAG) && \
		docker rmi $(IMAGE_NAME):$(IMAGE_TAG) || true

create:
	@docker run \
		--name $(CONTAINER_NAME) --restart=always \
		-d -p $(PORT_NO):80 \
		$(IMAGE_NAME):$(IMAGE_TAG) 

kill:
	docker stop $(CONTAINER_NAME) && docker rm $(CONTAINER_NAME)

shell:
	docker exec -it $(CONTAINER_NAME) sh

logs:
	docker logs $(CONTAINER_NAME)

status:
	@docker ps --filter "name=$(CONTAINER_NAME)" \
		--filter "status=running" | grep -q $(CONTAINER_NAME);
	@if [ $$? -ne 0 ]; then echo 'not running'; else echo 'ok'; fi

docker_ip:
	@ip addr show docker0 | grep "inet\b" | awk '{print $2}' | cut -d/ -f1

