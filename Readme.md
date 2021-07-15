# What is this repo about

Products api to favorite products

# Tecnologies that will be used.

  - nodejs 15.12.0
  - typescript 4.3.5
  - docker 20.10.5 build 55c4c88
  - yarn 1.22.10

  # How to run development

  1 -> set the NODE_ENV To desired environment Ex. development
  2 -> yarn or npm install
  3 -> copy .env.sample to .env.${environment desired} Ex. .env.development
       Or you quem set all variables directly on the OS system
  4 -> create database with the value of the env DB_DATABASE on postgres
  5 -> run migrates with yarn typeorm migration:run
  6 -> yarn server or npm run server will show "Listening on port xxxx env. yyyy"

# how to build for production.

  1 -> yarn build or npm run build
  2 -> copy folder build to the server disered.
  3 -> all envs vars are mandatory or file or on os.
# end points

  post /api/customers
    body: {
      "name": "jhonDoe",
      "email": "jhondoe@foo.bar",
      "password": "123456"
    }
