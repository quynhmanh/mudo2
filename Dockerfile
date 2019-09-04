FROM gcr.io/google-appengine/aspnetcore:2.2
ADD ./bin/Release/netcoreapp2.2/publish/ /app
ENV ASPNETCORE_URLS=http://*:${PORT}
WORKDIR /app
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get install -y software-properties-common
RUN apt-get install --yes nodejs
RUN apt install $(cat /app/wwwroot/pkglist) -y
RUN apt-get update 
RUN apt-get install -y --no-install-recommends libgdiplus libc6-dev
RUN rm -rf /var/lib/apt/lists/*
RUN apt update
RUN apt install -y python3-pip
RUN pip install tensorflow
RUN pip install image
RUN ./setup.sh
ENTRYPOINT [ "dotnet", "RCB.TypeScript.dll"]
