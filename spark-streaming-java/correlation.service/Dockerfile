FROM maven:3.6.0-jdk-8 AS build
COPY . .
RUN mvn clean package

#
# Package stage
#
FROM gcr.io/distroless/java  
COPY --from=build ./target/correlation.service-1.0-SNAPSHOT.jar /usr/app/correlation.service-1.0-SNAPSHOT.jar 
EXPOSE 8080  
ENTRYPOINT ["java","-jar","/usr/app/correlation.service-1.0-SNAPSHOT.jar"] 
