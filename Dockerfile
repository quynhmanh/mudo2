FROM gcr.io/google-appengine/aspnetcore:2.2
ADD ./bin/Release/netcoreapp2.2/publish/ /app
ENV ASPNETCORE_URLS=http://*:${PORT}
WORKDIR /app
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get install -y software-properties-common
RUN apt-get install --yes nodejs
RUN apt install $(cat /app/pkglist) -y
ENTRYPOINT [ "dotnet", "RCB.TypeScript.dll"]
