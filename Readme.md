# What is this repo about

Api to favorite products

# Tecnologies that will be used.

- nodejs 15.12.0
- typescript 4.3.5
- docker 20.10.5 build 55c4c88
- yarn 1.22.10
- npm 7.6.3
# How to run development


- copy .env.sample to .env.development
- set the variables on env.development
- yarn or npm install
- yarn db:prepare will create database and run migrations
- yarn server or npm run server will show "Listening on port xxxx env. yyyy"

# create database

- yarn db:prepare

# drop database

- yarn db:drop

# run test

yarn tests

# how to build for production.

- yarn build or npm run build
- copy folder build to the server disered.
- all envs vars are mandatory or file or on os.
- production run command npm run server-prod

# TODO - would be greate to implement it -

- endpoint para limpar cache de produtos
- CRUD de roles.

# Dockerfile.production

 - dockerfile to build image for production
