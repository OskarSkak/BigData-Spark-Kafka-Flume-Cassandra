# Define node-builder stage
FROM node:10-alpine AS build-node
WORKDIR /ClientApp
COPY ClientApp/package.json .
COPY ClientApp/package-lock.json .
RUN npm install
COPY ClientApp/ .
RUN npm run build

# Define .Net-builder stage
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-api
ENV BuildingDocker true
WORKDIR /app

# copy csproj and restore respective projects
COPY *.sln .
COPY *.csproj ./spark-api/

# Restore each projects


# After restore copy all the code and build the App
COPY . ./spark-api/

# Change workdir to NextPipe and build from the .csproj file
WORKDIR /app/spark-api
RUN dotnet publish -c Release -o out

# Define runtime stage. Create /app workdir and copy the build
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS runtime
WORKDIR /app
COPY --from=build-api /app/spark-api/out ./
COPY --from=build-node /ClientApp/build ./ClientApp/build
ENTRYPOINT [ "dotnet", "spark-api.dll" ]