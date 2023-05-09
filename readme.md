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

### 2.1 Install admin service dependencies
- Run `docker-compose exec admin composer install` to install dependencies
- Copy `.env.example` to `.env` and change the values to your needs
- Run `docker-compose exec key:generate` to generate application key
- Run `docker-compose exec admin php artisan migrate` to migrate database

## 3. Enjoy
- Go to `http://localhost:3001` to see todo app