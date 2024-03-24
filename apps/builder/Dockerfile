FROM gradle:8.6-jdk21-alpine AS builder
WORKDIR /project
COPY . .
RUN gradle bootJar

FROM eclipse-temurin:21-jdk-alpine
WORKDIR /project
COPY --from=builder /project/build/libs/builder.jar .

RUN apk update
RUN apk upgrade
RUN apk add curl

EXPOSE 8080:8080
ENTRYPOINT [ "java", "-jar", "builder.jar" ]
