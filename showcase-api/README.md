<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running the docker

```bash
export APP_ENV=production or APP_ENV=development

docker-compose up -d --build 
docker-compose up --force-recreate 
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker Setup Examples

* https://github.com/DanWahlin/CodeWithDanDockerServices  
* https://blog.logrocket.com/containerized-development-nestjs-docker/


## NestJS Techniques Used

#### Database communication (Postgres)
* https://docs.nestjs.com/techniques/database
* https://github.com/typeorm/typeorm
* https://github.com/brianc/node-postgres/tree/master/packages/pg

#### Authentication / Security
* https://docs.nestjs.com/techniques/authentication
* https://github.com/neoteric-eu/nestjs-auth
* https://github.com/lujakob/nestjs-realworld-example-app/tree/master/src

#### Logger
* https://docs.nestjs.com/techniques/logger  
* https://github.com/winstonjs/winston
* https://medium.com/@davidmcintosh/winston-a-better-way-to-log-793ac19044c5

#### Swagger
* https://docs.nestjs.com/recipes/swagger#openapi-swagger

### Testing (with database)
https://docs.nestjs.com/techniques/database#testing
https://medium.com/@jackallcock97/unit-testing-with-nestjs-and-jest-a-comprehensive-tutorial-464910f6c6ba
https://github.com/YegorZaremba/typeorm-mock-unit-testing-example/blob/e71fb36b917b9d934ce3203286730b72f2205d80/README.md

-----

### Docker
#### Run terminal in container
Windows: https://stackoverflow.com/questions/30172605/how-do-i-get-into-a-docker-containers-shell )  
```
docker exec -it <container-id> sh
```
