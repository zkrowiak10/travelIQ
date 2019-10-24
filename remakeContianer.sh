docker rm -f postgres1
docker run --rm --name postgres1 -e POSTGRES_PASSWORD=docker -v $(pwd)/data:/var/lib/postgresql/data -d -p 5432:5432  postgres
docker container rm -f flaskApp
docker run --rm --name flaskApp -it --link postgres1:postgres -p 5000:5000 -v $(pwd):/dataVol flask


