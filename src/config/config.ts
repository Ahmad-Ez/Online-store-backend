import dotenv from 'dotenv';
dotenv.config();

const {
  PG_ROOT_USER,
  PG_ROOT_PASS,
  PG_ROOT_DB,
  POSTGRES_HOST,
  POSTGRES_PORT,
  PG_STORE_DB,
  PG_STORE_TEST_DB,
  PG_STORE_USER,
  PG_STORE_PASSWORD,
  ENV,
  BCRYPT_PASSWORD,
  SALT_ROUNDS,
  TOKEN_SECRET,
} = process.env;

const config = {
  pg_root_user: <string>PG_ROOT_USER,
  pg_root_pass: <string>PG_ROOT_PASS,
  pg_root_db: <string>PG_ROOT_DB,
  postgres_host: <string>POSTGRES_HOST,
  postgres_port: parseInt(<string>POSTGRES_PORT),
  pg_store_db: <string>PG_STORE_DB,
  pg_store_test_db: <string>PG_STORE_TEST_DB,
  pg_store_user: <string>PG_STORE_USER,
  pg_store_password: <string>PG_STORE_PASSWORD,
  env: <string>ENV,
  pepper: <string>BCRYPT_PASSWORD,
  salt_rounds: parseInt(<string>SALT_ROUNDS),
  jwt_secret: <string>TOKEN_SECRET,
};

export default config;
