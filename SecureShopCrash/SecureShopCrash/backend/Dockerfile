# Stage 1: Build the application
FROM maven:3.9.8-eclipse-temurin-21-jammy AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.war app.war
# Or if it's packaged as jar, target/*.jar app.jar. Since pom.xml says <packaging>war</packaging>, it will be a .war file.
# Spring Boot can run executable war files just like jar files.

EXPOSE 12345
ENTRYPOINT ["java", "-jar", "app.war"]
