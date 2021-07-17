# What is this repo about

Api to favorite products

# Tecnologies that will be used.

- nodejs 15.12.0
- typescript 4.3.5
- docker 20.10.5 build 55c4c88
- yarn 1.22.10
- npm 7.6.3

# How to run development

- set the NODE_ENV To desired environment Ex. development
- yarn or npm install
- copy .env.sample to .env.${environment desired} Ex. .env.development
  Or you can set all variables directly on the OS system
- yarn db:prepare will create database and run migrations
- yarn server or npm run server will show "Listening on port xxxx env. yyyy"

# how to build for production.

- yarn build or npm run build
- copy folder build to the server disered.
- all envs vars are mandatory or file or on os.

# TODO - would be greate to implement it -

- endpoint para limpar cache de produtos
- CRUD de roles.

