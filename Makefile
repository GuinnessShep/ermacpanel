SHELL := /bin/bash
include .env

.PHONY: backend.updateRoles

install:
	sudo apt-get update
	sudo apt-get install unzip build-essential apt-transport-https ca-certificates curl gnupg lsb-release -y
	apt -y install docker.io docker-compose

ports:
	sudo iptables -I INPUT -p tcp -m tcp --dport ${BACKEND_PORT} -j ACCEPT
	sudo iptables -I INPUT -p tcp -m tcp --dport ${FRONTEND_PORT} -j ACCEPT
	sudo iptables -I INPUT -p tcp -m tcp --dport ${GOLANG_PORT} -j ACCEPT

env:
	cp backend/.env.example backend/.env
	cp frontend/.env.example frontend/.env
	cp frontend/.env.production.example frontend/.env.production
	cp golang/.env.example golang/.env
	sed -i "s|DB_PORT=|DB_PORT=${MYSQL_PORT}|g" backend/.env
	sed -i "s|DB_DATABASE=|DB_DATABASE=${MYSQL_DATABASE}|g" backend/.env
	sed -i "s|DB_USERNAME=|DB_USERNAME=${MYSQL_USER}|g" backend/.env
	sed -i "s|DB_PASSWORD=|DB_PASSWORD=${MYSQL_PASSWORD}|g" backend/.env
	sed -i "s|APP_TIMEZONE=|APP_TIMEZONE=${TIMEZONE}|g" backend/.env
	sed -i "s|REACT_APP_BACKEND_URL=|REACT_APP_BACKEND_URL=${BACKEND_URL}|g" frontend/.env
	sed -i "s|REACT_APP_BACKEND_URL=|REACT_APP_BACKEND_URL=${BACKEND_URL}|g" frontend/.env.production
	sed -i "s|REACT_APP_TIMEZONE=|REACT_APP_TIMEZONE=${TIMEZONE}|g" frontend/.env
	sed -i "s|REACT_APP_TIMEZONE=|REACT_APP_TIMEZONE=${TIMEZONE}|g" frontend/.env.production
	sed -i "s|USER1=|USER1=${MYSQL_USER}|g" golang/.env
	sed -i "s|PASS=|PASS=${MYSQL_PASSWORD}|g" golang/.env
	sed -i "s|DATABASE=|DATABASE=${MYSQL_DATABASE}|g" golang/.env
	sed -i "s|PORT=|PORT=${GOLANG_PORT}|g" golang/.env

build:
	chmod 775 golang/server_go
	docker-compose build
	docker-compose up -d
	docker-compose exec backend chown -R www-data:www-data .
	docker-compose exec backend composer install
	docker-compose exec backend php artisan migrate
	docker-compose exec backend php artisan db:seed
	docker-compose exec backend chown -R www-data:www-data .
	docker-compose exec frontend npm install
	docker-compose exec frontend npm run build

build.backend:
	docker-compose exec backend chown -R www-data:www-data .
	docker-compose exec backend composer install
	docker-compose exec backend php artisan migrate
	docker-compose exec backend php artisan db:seed

build.frontend:
	docker-compose exec frontend npm install
	docker-compose exec frontend npm run build

restart:
	docker-compose restart

stop:
	docker-compose stop

down:
	docker-compose down -v

backend.updateRoles:
	docker-compose exec backend php artisan db:seed RolesSeeder
	docker-compose exec backend php artisan cache:forget spatie.permission.cache