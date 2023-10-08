FROM gradle:8-jdk17-alpine
WORKDIR /app
COPY ./src ./src
COPY /gradle /gradle
COPY *.gradle.kts .
COPY gradlew .
COPY gradlew.bat .
COPY start.sh .
RUN gradle build
CMD ["sh", "start.sh"]
