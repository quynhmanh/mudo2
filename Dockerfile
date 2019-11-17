FROM gcr.io/google-appengine/aspnetcore:2.2
FROM node:8.2
ADD ./bin/Release/netcoreapp2.2/publish/ /app
ENV ASPNETCORE_URLS=http://*:${PORT}
WORKDIR /app
RUN sed -i 's|http://archive.ubuntu.com/ubuntu/|http://mirror.0x.sg/ubuntu/|g' /etc/apt/sources.list
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
# RUN apt update
# RUN apt-get install -y software-properties-common
RUN apt-get install --yes nodejs
RUN apt install $(cat /app/wwwroot/pkglist) -y
# RUN apt-get update 
RUN apt-get install -y --no-install-recommends libgdiplus libc6-dev
RUN rm -rf /var/lib/apt/lists/*
# RUN apt update
# RUN apt install -y python3-pip
# RUN pip3 install tensorflow
# RUN pip3 install image
RUN chmod a+x setup.sh  
ADD setup.sh /


RUN apt update
RUN apt install -y ffmpeg

RUN apt-get update &&\
apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget \
xvfb x11vnc x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps

RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN dpkg -i google-chrome-stable_current_amd64.deb

ENV DISPLAY :99

ENTRYPOINT ["/bin/bash", "/app/setup.sh"]
