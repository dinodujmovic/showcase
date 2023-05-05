# Showcase

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.24.

-------------
## Production

Install docker https://www.docker.com/products/docker-desktop

#### Run:
```
docker-compose -f docker-compose-prod.yml up -d --build
```

###### Manual Dockerfile build:
```
docker build -t showcase-angular:prod -f app.production.prod
```

###### Manual Dockerfile run:
```
docker run -p 80:80 showcase-angular:prod
```

-------------
---------------
## Development with Docker

#### Run with docker:
``` 
docker-compose up 
```

#### Run tests:
```
docker exec -it showcase-angular-dev npm run test --watch=false
```

###### Manual Dockerfile build:
```
docker build -t showcase-angular:dev -f app.development.dockerfile .
```

###### Manual Dockerfile run:
```
# Mac
docker run -v ${PWD}:/app -v /app/node_modules -p 4201:4200 --rm showcase-angular:dev

# windows PowerShell
docker run -v /$(pwd):/app -v /app/node_modules -p 4201:4200 --rm showcase-angular:dev

# windows cmd
docker run -v %cd%:/app -v /app/node_modules -p 4201:4200 --rm showcase-angular:dev
```

To remove all containers, you can use docker  
> docker rm $(docker ps -a -q)

and to remove all images, run  

> docker rmi $(docker images -q)  
---------------
## Development Local

Install node https://nodejs.org/en/

```
 npm install
 npm run start
```
---------------
## Docker setup/issues

https://mherman.org/blog/dockerizing-an-angular-app/

https://blog.codewithdan.com/docker-volumes-and-print-working-directory-pwd/

https://stackoverflow.com/questions/41485217/mount-current-directory-as-a-volume-in-docker-on-windows-10

Currently, node_modules volume doesn't work on Windows without installing node_modules locally.

Explore docker image example:  
docker run -i -t nginx /bin/bash


-------------

## NGRX
* https://ngrx.io/docs  
* https://github.com/DanWahlin/angular-architecture/tree/master/state-management/ngrx  
* https://mherman.org/blog/authentication-in-angular-with-ngrx/
