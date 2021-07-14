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

const DBConfig = {};

export { ServerConfigs, DBConfig };
