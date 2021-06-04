current_dir := $(shell pwd)
project := $(notdir $(current_dir))

gitsha := $(shell git rev-parse HEAD)
gitsha_last := $(shell git rev-parse HEAD~1)

branch_name := $(shell git rev-parse --abbrev-ref HEAD)
branch_clean := $(shell git rev-parse --abbrev-ref HEAD | sed 's/^\///;s/\///g')

image_name := $(shell git remote show origin | grep -e 'Push.*URL.*github.com' | rev | cut -d '/' -f 1 | rev | cut -d '.' -f 1)

build_timestamp := $(shell date +%s)

version := $(shell git rev-list --count $(branch_name))
image_tag := "$(branch_clean)-$(version)"

all: help

help:
	@echo 'Management commands for backend:'
	@echo
	@echo 'Usage:'
	@echo '    make build           Build the project.'
	@echo '    make clean           Clean the directory tree.'
	@echo '    make image           Build local docker image.'
	@echo

define create_volume
$(call delete_volume,$(1))
docker volume create $(1)
endef

define delete_volume
$(call unmount_volume,$(1))
docker volume rm $(1) > /dev/null 2>&1 || true
endef

define mount_volume
docker create --mount source=$(1),target=$(2) --name $(1) alpine:3.8 /bin/true
endef

define unmount_volume
docker rm -f $(1) > /dev/null 2>&1 || true
endef

jwt.keys:
	mkdir .certs
	openssl ecparam -genkey -name secp521r1 -noout -out .certs/api-jwt-private.pem
	openssl ec -in .certs/api-jwt-private.pem -pubout -out .certs/api-jwt-public.pem

start:
	docker compose up

stop:
	docker compose down

build:
	docker compose build

clean:
	rm -rf dist/
	rm -rf node_modules/
	rm *.log

image:
	docker build \
		--build-arg GITSHA=$(gitsha) \
		--build-arg VERSION=$(version) \
		-f docker/Dockerfile.production \
		-t twinelabs/$(image_name):$(image_tag) \
		-t twinelabs/$(image_name):latest \
		.

sentry:
	$(call create_volume,$(image_name)-sentry)
	$(call mount_volume,$(image_name)-sentry,/work)
	docker cp . $(image_name)-sentry:/work
	docker run --rm \
		--volumes-from $(image_name)-sentry \
		-e SENTRY_AUTH_TOKEN \
		getsentry/sentry-cli releases \
			-o twine-labs \
			-p $(image_name) \
			set-commits \
			-c "twineteam/$(image_name)@$(gitsha_last)..$(gitsha)" \
			$(image_name)@$(version)
	$(call delete_volume,$(image_name)-sentry)
