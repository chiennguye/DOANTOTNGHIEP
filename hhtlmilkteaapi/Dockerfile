FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests
RUN ls -la target/

FROM openjdk:17-slim
WORKDIR /app
COPY --from=build /app/target/hhtlmilkteaapi-0.0.1.jar app.jar
RUN ls -la
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"] 