FROM gcr.io/google-appengine/aspnetcore:2.2
ADD ./bin/Release/netcoreapp2.2/publish/ /app
ENV ASPNETCORE_URLS=http://*:${PORT}
WORKDIR /app
RUN sed -i 's|http://|http://sg.|g' /etc/apt/sources.list
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt update
RUN apt-get install -y software-properties-common
RUN apt-get install --yes nodejs
RUN apt install $(cat /app/wwwroot/pkglist) -y
RUN apt-get update 
RUN apt-get install -y --no-install-recommends libgdiplus libc6-dev
RUN rm -rf /var/lib/apt/lists/*
RUN apt update
RUN apt install -y python3-pip
RUN pip3 install tensorflow
RUN pip3 install image
RUN chmod a+x setup.sh  
RUN sh setup.sh
ENTRYPOINT [ "dotnet", "RCB.TypeScript.dll"]