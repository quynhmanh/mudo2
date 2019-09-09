docker run -p 64099:5003 -v /root/test-extension:/app/test-extension -v /root/images:/app/wwwroot/images -v /root/fonts:/app/wwwroot/fonts -v /root/videos:/app/wwwroot/videos --net=mynet --add-host=host_container_address:192.168.0.1 kjackal/hello-dotnet:v1

