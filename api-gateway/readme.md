


Reload container

```shell

docker exec container_name nginx -s reload

docker exec container_name nginx -s stop

```


## Get container network host 
```shell
docker network inspect bridge

# Gateway": "172.17.0.1"
```