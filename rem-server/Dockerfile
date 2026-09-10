# Build stage
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

COPY . .

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /opt

RUN addgroup -S spring && adduser -S spring -G spring

COPY --from=builder /app/target/*.jar rem-server.jar

ENV SPRING_FLYWAY_ENABLED=true \
    SPRING_FLYWAY_BASELINE_ON_MIGRATE=true \
    SPRING_FLYWAY_BASELINE_VERSION=0 \
    SPRING_PROFILES_INCLUDE=seed

USER spring:spring

EXPOSE 80

ENTRYPOINT ["java", "-jar", "rem-server.jar"]
