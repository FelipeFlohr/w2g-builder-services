FROM gradle:8-jdk17-alpine as builder
COPY ./src ./src
COPY ./gradle ./gradle
COPY ./build.gradle.kts .
COPY /gradlew .
COPY /gradlew.bat .
COPY /settings.gradle.kts .
RUN gradle build
RUN gradle bootJar
CMD ["ls"]

# FROM openjdk:17-alpine
# COPY --from=builder ./build/libs/gateway-application.jar .
# CMD [ "java", "-jar", "gateway-application.jar" ]