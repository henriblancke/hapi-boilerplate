# hapi-boilerplate

### Technologies

* Docker
* Hapi.js
    * Boom -> unified HTTP responses
    * Joi -> validation
    * JWT with ES512 (public key can be shared with other projects to validate JWT)
* Swagger/OpenAPI documentation
    * Automatically identifies models using Joi
* Centralized configuration
* PostgreSQL
* TypeORM
* Typescript
* Dotenv, to centralize environment variables for easy local development
* Prometheus
    * Out of the box endpoint instrumentation
    * Customizable metrics to track app behavior

### Run to project

```bash
# builds the docker image
make build
# starts the server and runs migrations
make start
```

### Access the API documentation

Go to http://localhost:8000/documentation

### Handy Make commands

Build the docker image (Option 1)
```bash
make image 
```

Build docker image with docker-compose (Option 2)
```bash
make build
```

Run the project. This will spin up a pg database and run the project locally in docker with live reload enabled for easy development.
```bash
make start
```

To shutdown:
```bash
make stop
```

Multi stage build for a leaner prod image 
```bash
make image-prod
```


### TypeORM

Some handy commands:

```yarn typeorm --help```

```yarn typeorm -- migrations:generate --name test```


## Generate JWT keys
```
mkdir .certs && cd .certs
# ES512
# private key
openssl ecparam -genkey -name secp521r1 -noout -out api-jwt-private.pem
# public key
openssl ec -in api-jwt-private.pem -pubout -out api-jwt-public.pem
```

or 

```
make jwt.keys
```
