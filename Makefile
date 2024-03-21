DOCKER_IMAGE="near-streamer"

build-docker:
	docker build -t $(DOCKER_IMAGE) .
swarm-start:
	bash scripts/swarm-start.sh
compose-up:
	make build-docker
	docker-compose up