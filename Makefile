help:
	@echo 'Management commands for backend:'
	@echo
	@echo 'Usage:'
	@echo '    make build           Build the project.'
	@echo '    make clean           Clean the directory tree.'
	@echo '    make image           Build local docker image.'
	@echo

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
	docker build -f docker/Dockerfile -t backend .

image-prod:
	docker build -f docker/Dockerfile.production -t backend-prod .
