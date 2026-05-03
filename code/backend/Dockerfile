# =========================
# Stage 1 — Build
# =========================
FROM eclipse-temurin:21-jdk-alpine AS build

# Atualiza pacote zlib para corrigir CVE-2023-45853
# Atualiza pacote libpng para corrigir CVE-2026-25646
# Criar usuário não-root para build
RUN apk update && apk upgrade zlib && apk upgrade libpng && addgroup -S gradle && adduser -S gradle -G gradle

USER gradle
WORKDIR /app

# Copiar apenas arquivos necessários para cache de dependências
COPY --chown=gradle:gradle gradlew .
COPY --chown=gradle:gradle gradle gradle
COPY --chown=gradle:gradle build.gradle.kts settings.gradle.kts ./
RUN chmod +x gradlew

# Baixar dependências
RUN ./gradlew dependencies --no-daemon || true

# Copiar código fonte e gerar jar
COPY --chown=gradle:gradle src src
RUN ./gradlew bootJar --no-daemon

# Extrair layers do Spring Boot para otimizar cache no runtime
RUN java -Djarmode=layertools -jar build/libs/*.jar extract --destination build/extracted

# =========================
# Stage 2 — Runtime
# =========================
FROM eclipse-temurin:21-jre-alpine

# Atualiza pacote zlib para corrigir CVE-2023-45853
RUN apk update && apk upgrade zlib

# Atualiza pacote libpng para corrigir CVE-2026-25646
RUN apk update && apk upgrade libpng


# Criar usuário não-root com UID/GID fixos
RUN addgroup -S -g 1001 spring && adduser -S -u 1001 -G spring spring

WORKDIR /app

# Copiar layers extraídas em ordem (mais estáveis primeiro = melhor cache)
COPY --from=build --chown=spring:spring /app/build/extracted/dependencies/ ./
COPY --from=build --chown=spring:spring /app/build/extracted/spring-boot-loader/ ./
COPY --from=build --chown=spring:spring /app/build/extracted/snapshot-dependencies/ ./
COPY --from=build --chown=spring:spring /app/build/extracted/application/ ./

USER spring

# Variáveis de runtime — configuráveis via env ou docker-compose
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75 -Djava.security.egd=file:/dev/./urandom -Dspring.backgroundpreinitializer.ignore=true"

# Porta declarada (não publica automaticamente — só documenta)
EXPOSE 8080

# Healthcheck via actuator
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 CMD wget -qO- http://localhost:8080/actuator/health || exit 1

# Usar exec form com array evita que JAVA_OPTS seja ignorado em alguns SOs
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS org.springframework.boot.loader.launch.JarLauncher"]