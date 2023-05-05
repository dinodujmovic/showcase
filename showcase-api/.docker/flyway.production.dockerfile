
FROM 		flyway/flyway:latest

LABEL       author="Dino Dujmovic"

COPY        ./.docker/config/flyway.production.conf /flyway/conf/flyway.conf
COPY        ./.docker/db/postgres/migrations/sql /flyway/sql

CMD  ["migrate"]
