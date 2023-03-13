// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Pool } from 'pg';
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
} = process.env;

const root_client = new Pool({
  host: POSTGRES_HOST,
  database: PG_ROOT_DB,
  user: PG_ROOT_USER,
  password: PG_ROOT_PASS,
  port: parseInt(<string>POSTGRES_PORT),
});

const dev_client = new Pool({
  host: POSTGRES_HOST,
  database: PG_STORE_DB,
  user: PG_ROOT_USER,
  password: PG_ROOT_PASS,
  port: parseInt(<string>POSTGRES_PORT),
});

const test_client = new Pool({
  host: POSTGRES_HOST,
  database: PG_STORE_TEST_DB,
  user: PG_ROOT_USER,
  password: PG_ROOT_PASS,
  port: parseInt(<string>POSTGRES_PORT),
});

const create_user = async (client: Pool) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const conn = await client.connect();
    await conn.query(`CREATE USER ${PG_STORE_USER} WITH PASSWORD '${PG_STORE_PASSWORD}'`);
    await conn.query(`CREATE DATABASE ${PG_STORE_DB}`);
    await conn.query(`CREATE DATABASE ${PG_STORE_TEST_DB}`);

    conn.release();
    return true;
  } catch (err) {
    console.error(`Error while creating user ${PG_STORE_USER}. ${err}`);
    return false;
  }
};

const create_dev_db = async (r_client: Pool, d_client: Pool) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore

    const d_conn = await d_client.connect();
    await d_conn.query(`GRANT ALL PRIVILEGES ON DATABASE ${PG_STORE_DB} TO ${PG_STORE_USER}`);
    await d_conn.query(`GRANT ALL PRIVILEGES ON SCHEMA public TO ${PG_STORE_USER}`);
    d_conn.release();

    return true;
  } catch (err) {
    console.error(`Error while creating database ${PG_STORE_DB}. ${err}`);
    return false;
  }
};

const create_test_db = async (r_client: Pool, t_client: Pool) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore

    const t_conn = await t_client.connect();
    await t_conn.query(`GRANT ALL PRIVILEGES ON DATABASE ${PG_STORE_TEST_DB} TO ${PG_STORE_USER}`);
    await t_conn.query(`GRANT ALL PRIVILEGES ON SCHEMA public TO ${PG_STORE_USER}`);
    t_conn.release();

    return true;
  } catch (err) {
    console.error(`Error while creating database ${PG_STORE_TEST_DB}. ${err}`);
    return false;
  }
};

const initialize_dbs = async () => {
  await create_user(root_client).then((result) => {
    if (result) {
      console.log(`User created: ${PG_STORE_USER}`);
    }
  });

  await create_dev_db(root_client, dev_client).then((result) => {
    if (result) {
      console.log(`Database created: ${PG_STORE_DB}`);
    }
  });

  await create_test_db(root_client, test_client).then((result) => {
    if (result) {
      console.log(`Database created: ${PG_STORE_TEST_DB}`);
    }
  });

  root_client.end();
  dev_client.end();
  test_client.end();
};

initialize_dbs();

export default initialize_dbs;
