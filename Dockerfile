FROM gcr.io/google-appengine/aspnetcore:2.2
ADD ./bin/Release/netcoreapp2.2/publish/ /app
ENV ASPNETCORE_URLS=http://*:${PORT}
WORKDIR /app
RUN echo "deb mirror://mirrors.ubuntu.com/mirrors.txt trusty main restricted universe multiverse" > /etc/apt/sources.list && \
    echo "deb mirror://mirrors.ubuntu.com/mirrors.txt trusty-updates main restricted universe multiverse" >> /etc/apt/sources.list && \
    echo "deb mirror://mirrors.ubuntu.com/mirrors.txt trusty-security main restricted universe multiverse" >> /etc/apt/sources.list && \
    DEBIAN_FRONTEND=noninteractive apt-get update
    
RUN apt-get update
RUN apt-get install sudo

RUN adduser --disabled-password --gecos '' docker
RUN adduser docker sudo
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER docker

RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
RUN apt-get install -y nodejs
RUN apt-get install -y software-properties-common
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
