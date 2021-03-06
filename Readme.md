# What is this repo about

Api to favorite products

# Tecnologies used.

- nodejs 15.12.0
- typescript 4.3.5
- docker 20.10.5 build 55c4c88
- yarn 1.22.10
- npm 7.6.3

# Dbs

- postgress
- redis

# How to run development


- copy .env.sample to .env.development
- set the variables on env.development
- yarn or npm install
- yarn db:prepare will create database and run migrations
- yarn server or npm run server will show "Listening on port xxxx env. yyyy"

# create database and migrate

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
# Dockerfile.production

 - dockerfile to build image for production

# Api docs

## Login

-  Authenticate

    ```
    post /api/login
    {
      "email": "rogerio_pd@yahoo.com.br",
      "password": "123456"
    }
    ```

## Customer

- Create customer

  ```
  post /api/customer

  {
    "name": "Rogerio bispo",
    "email": "rogerio_pd@yahoo.com.br"
    "password": "123456"
  }
  ```

- Update customer - with bearer token only the logged customer

  ```
  patch/put /api/customer/:id

  {
    "name": "Rogerio bispo",
    "email": "rogerio_pd@yahoo.com.br"
    "password": "123456"
  }
  ```

- Delete customer with bearer token only the logged customer

  ```
  delete /api/customers/:id
  ```

- Show customer with bearer token only the logged customer

  ```
  get /api/customers/:id
  ```
## Favorite

- Add favorite - with bearer
  the customer will retreived from the token

  ```
  post /api/products/:id/favorite - with bearer
  ```
  - Remove favorite

  ```
  delete /api/products/:id/favorite - with bearer
  ```
## Cache

- Clear all products cheched

  ```
  delete /api/cache - with bearer
  ```

