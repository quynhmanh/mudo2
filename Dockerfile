FROM gcr.io/google-appengine/aspnetcore:2.2
ADD ./bin/Release/netcoreapp2.2/publish/ /app
ENV ASPNETCORE_URLS=http://*:${PORT}
WORKDIR /app
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get install -y software-properties-common
RUN apt-get install --yes nodejs
RUN apt install $(cat /app/wwwroot/pkglist) -y
RUN apt-get postgresql
RUN apt-get update 
RUN apt-get install -y --no-install-recommends libgdiplus libc6-dev
RUN rm -rf /var/lib/apt/lists/*
ENTRYPOINT [ "dotnet", "RCB.TypeScript.dll"]
