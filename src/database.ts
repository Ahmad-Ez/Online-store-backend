import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {
  POSTGRES_HOST,
  PG_STORE_DB,
  POSTGRES_PORT,
  PG_STORE_TEST_DB,
  PG_ROOT_USER,
  PG_ROOT_PASS,
  ENV,
} = process.env;

console.log(`ENV = ${ENV}`);

let current_db;

if (ENV === 'dev') {
  current_db = PG_STORE_DB;
}

if (ENV === 'test') {
  current_db = PG_STORE_TEST_DB;
}

const client: Pool = new Pool({
  host: POSTGRES_HOST,
  database: current_db,
  user: PG_ROOT_USER,
  password: PG_ROOT_PASS,
  port: parseInt(<string>POSTGRES_PORT),
});

export default client;
