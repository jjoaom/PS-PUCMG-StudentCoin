FROM eclipse-temurin:21-jdk-alpine AS build

RUN apk add --no-cache zlib libpng && \
    addgroup -S gradle && adduser -S gradle -G gradle

USER gradle
WORKDIR /app

COPY --chown=gradle:gradle gradlew .
COPY --chown=gradle:gradle gradle gradle
COPY --chown=gradle:gradle build.gradle.kts settings.gradle.kts ./
RUN chmod +x gradlew

ENV GRADLE_USER_HOME=/home/gradle/.gradle

RUN ./gradlew dependencies --no-daemon

COPY --chown=gradle:gradle src src

RUN ./gradlew bootJar --no-daemon

RUN java -Djarmode=layertools -jar build/libs/*.jar extract --destination build/extracted


FROM eclipse-temurin:21-jre-alpine

RUN apk add --no-cache curl zlib libpng

RUN addgroup -S -g 1001 spring && adduser -S -u 1001 -G spring spring

WORKDIR /app

COPY --from=build --chown=spring:spring /app/build/extracted/dependencies/ ./
COPY --from=build --chown=spring:spring /app/build/extracted/spring-boot-loader/ ./
COPY --from=build --chown=spring:spring /app/build/extracted/snapshot-dependencies/ ./
COPY --from=build --chown=spring:spring /app/build/extracted/application/ ./

USER spring

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75 -Djava.security.egd=file:/dev/./urandom"

EXPOSE 8080

HEALTHCHECK CMD curl -f http://localhost:8080/api/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS org.springframework.boot.loader.launch.JarLauncher"]