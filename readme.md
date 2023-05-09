# Guide
## 1. Build docker container

### 1.1. Setting up docker environment
- Copy `.env.example` to `.env` and change the values to your needs
- `DOCKER_UID` and `DOCKER_GID` are the user id and group id of the user that will be used inside the container. You can get them by running `echo $UID` and `echo $GID` in your terminal.

### 1.2. Build the container
- Run `docker-compose build` to build the container

### 1.3. Start the container
- Run `docker-compose up -d` to start the container

## 2. Install dependencies

### 2.1 Install api service dependencies
- Run `docker-compose exec api composer install` to install dependencies
- Copy `.env.example` to `.env` and change the values to your needs
- Run `docker-compose exec api php artisan key:generate` to generate application key
- Run `docker-compose exec api php artisan migrate` to migrate database
- Run `docker-compose exec api php artisan migrate --env=testing` to migrate database test

### Testing
- Run `docker-compose exec api php artisan test --filter TodoTest` to test feature todo


## 3. Enjoy
- Go to `http://localhost:3001` to see todo app