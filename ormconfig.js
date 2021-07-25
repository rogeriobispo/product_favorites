const { DBConfig } = require('./src/shared/config');
const { NODE_ENV } = process.env

const {
  host,
  port,
  username,
  password,
  database,
  entities,
  migrations,
  cli,
} = DBConfig;

if(NODE_ENV !== 'test') console.log(`Runging migration on enviroment: ${process.env.NODE_ENV}, database: ${database}`);

const postgres = {
  type:  'postgres',
  host,
  port,
  username,
  password,
  database,
  entities,
  migrations,
  cli,
};

const sqlite = {
  type:  'sqlite',
  database: ':memory:',
  synchronize: true,
  logging: false,
  entities,
  migrations,
  cli,
}

module.exports = NODE_ENV === 'test' ? sqlite :  postgres;

