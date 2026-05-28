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

USER spring:spring

EXPOSE 80

ENTRYPOINT ["java", "-jar", "rem-server.jar"]