import { RedisOptions } from 'ioredis';
import * as dotenv from 'dotenv';
import path from 'path';

const envFile = !process.env.NODE_ENV
  ? `.env.development`
  : `.env.${process.env.NODE_ENV}`;

const file = path.join(__dirname, '..', 'env/', envFile);

dotenv.config({
  path: file,
});

const ServerConfigs = {
  port: Number(process.env.PORT),
  env: process.env.ENV,
};

const DBConfig = {
  host: String(process.env.DB_HOST),
  port: Number(process.env.DB_PORT),
  username: String(process.env.DB_USER),
  password: String(process.env.DB_PWD),
  database: String(process.env.DB_DATABASE),
  entities: ['src/modules/**/typeorm/entities/{*.ts,*.js}'],
  migrations: ['./src/database/migrations/{*.ts,*.js}'],
  cli: {
    migrationsDir: './src/database/migrations',
  },
};
const JwtConfig = {
  secret: String(process.env.JWT_SECRET),
  expireIn: Number(process.env.JWT_EXPIRE_TIME),
};

const ProductsApiConfig = {
  url: String(process.env.PRODUCTS_API_URL),
};

interface ICacheConfig {
  driver: 'redis';
  config: {
    redis: RedisOptions;
  };
}
const RedisTTLConfig = {
  type: String(process.env.REDIS_TTL_TYPE),
  expireIn: Number(process.env.REDIS_TTL_EXPIRE_TIME),
};
const RedisConfig = {
  driver: 'redis',
  config: {
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASS || '',
    },
  },
} as ICacheConfig;

export {
  ServerConfigs,
  DBConfig,
  JwtConfig,
  ProductsApiConfig,
  RedisConfig,
  RedisTTLConfig,
};
