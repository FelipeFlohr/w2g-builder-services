FROM gradle:8.6-jdk21-alpine AS builder
WORKDIR /project
COPY . .
RUN gradle assemble

FROM eclipse-temurin:21-jdk-alpine
WORKDIR /project
COPY --from=builder /project/build/filestorage-1.0-SNAPSHOT-runner.jar .

RUN apk update
RUN apk upgrade
RUN apk add curl

RUN mkdir storage
ENV LOCAL_STORAGE_PATH=/project/storage
EXPOSE 8080:8080
ENTRYPOINT [ "java", "-jar", "filestorage-1.0-SNAPSHOT-runner.jar" ]
