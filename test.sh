docker stop $(docker ps -q --filter ancestor=kjackal/hello-dotnet:v1 )
docker run -p 5003:5003  kjackal/hello-dotnet:v1

