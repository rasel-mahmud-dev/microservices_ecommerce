

Run postgres in Docker

```shell
docker container stop mypostgress
docker container rm -f mypostgress
docker run --name mypostgress -p 5432:5432 -e POSTGRES_USER=rasel -e POSTGRES_PASSWORD=12345 -v C:/Users/RaseL/Desktop/micro-services/database:/var/lib/postgresql/data postgres

```


[//]: # (docker run -d --name nginx-container --network my-network -p 80:80 my-nginx2)



```shell
# Get container ipv4 address
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' micro-services-products-1

```
