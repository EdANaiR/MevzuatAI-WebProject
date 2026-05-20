FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY MevzuatAI.Domain/MevzuatAI.Domain.csproj MevzuatAI.Domain/
COPY MevzuatAI.Application/MevzuatAI.Application.csproj MevzuatAI.Application/
COPY MevzuatAI.Infrastructure/MevzuatAI.Infrastructure.csproj MevzuatAI.Infrastructure/
COPY MevzuatAI.WebAPI/MevzuatAI.WebAPI.csproj MevzuatAI.WebAPI/

RUN dotnet restore MevzuatAI.WebAPI/MevzuatAI.WebAPI.csproj

COPY . .
RUN dotnet publish MevzuatAI.WebAPI/MevzuatAI.WebAPI.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "MevzuatAI.WebAPI.dll"]
