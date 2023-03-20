import { Pool } from 'pg';
import config from './config/config';

const {
  pg_root_user,
  pg_root_pass,
  postgres_host,
  postgres_port,
  pg_store_db,
  pg_store_test_db,
  env,
} = config;

// console.log(JSON.stringify(process.env, null, "  "));
let current_db: string;

if (env == 'test') {
  current_db = pg_store_test_db;
} else {
  current_db = pg_store_db;
}
const client: Pool = new Pool({
  host: postgres_host,
  database: current_db,
  user: pg_root_user,
  password: pg_root_pass,
  port: postgres_port,
});

console.log(`** ENV = ${env}`);
console.log(`** Current db = ${current_db}`);

export default client;
