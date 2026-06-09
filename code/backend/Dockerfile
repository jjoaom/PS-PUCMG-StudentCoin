FROM eclipse-temurin:21-jdk-alpine AS build

RUN apk add --no-cache zlib libpng \
    && addgroup -S gradle \
    && adduser -S gradle -G gradle

USER gradle
WORKDIR /app

ENV GRADLE_USER_HOME=/home/gradle/.gradle

COPY --chown=gradle:gradle gradlew .
COPY --chown=gradle:gradle gradle gradle
COPY --chown=gradle:gradle build.gradle.kts settings.gradle.kts ./
RUN chmod +x gradlew


RUN ./gradlew dependencies --no-daemon

COPY --chown=gradle:gradle src src

RUN ./gradlew bootJar --no-daemon


FROM eclipse-temurin:21-jre-alpine

RUN apk add --no-cache curl zlib libpng

RUN addgroup -S -g 1001 spring && adduser -S -u 1001 -G spring spring

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

USER spring

EXPOSE 8080

HEALTHCHECK CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]