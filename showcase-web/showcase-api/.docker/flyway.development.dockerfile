
FROM 		boxfuse/flyway:latest

LABEL       author="Dino Dujmovic"

COPY        ./.docker/config/flyway.development.conf /flyway/conf/flyway.conf
COPY        ./.docker/db/postgres/migrations/sql /flyway/sql

CMD  ["migrate"]
