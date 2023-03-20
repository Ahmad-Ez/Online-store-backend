// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Pool } from 'pg';
import config from '../config/config';

const {
  pg_root_user,
  pg_root_pass,
  pg_root_db,
  postgres_host,
  postgres_port,
  pg_store_db,
  pg_store_test_db,
  pg_store_user,
  pg_store_password,
} = config;

const root_client = new Pool({
  host: postgres_host,
  database: pg_root_db,
  user: pg_root_user,
  password: pg_root_pass,
  port: postgres_port,
});

const dev_client = new Pool({
  host: postgres_host,
  database: pg_store_db,
  user: pg_root_user,
  password: pg_root_pass,
  port: postgres_port,
});

const test_client = new Pool({
  host: postgres_host,
  database: pg_store_test_db,
  user: pg_root_user,
  password: pg_root_pass,
  port: postgres_port,
});

const create_user = async (client: Pool) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const conn = await client.connect();
    await conn.query(`CREATE user ${pg_store_user} WITH password '${pg_store_password}'`);
    await conn.query(`GRANT ALL PRIVILEGES ON SCHEMA public TO ${pg_store_user}`);
    conn.release();

    return true;
  } catch (err) {
    console.error(`Error while creating user ${pg_store_user}. ${err}`);
    return false;
  }
};

const create_dev_db = async (r_client: Pool, d_client: Pool) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const r_conn = await r_client.connect();
    await r_conn.query(`CREATE DATABASE ${pg_store_db}`);
    r_conn.release();

    const d_conn = await d_client.connect();
    await d_conn.query(`GRANT ALL PRIVILEGES ON DATABASE ${pg_store_db} TO ${pg_store_user}`);
    await d_conn.query(`GRANT ALL PRIVILEGES ON SCHEMA public TO ${pg_store_user}`);
    d_conn.release();

    return true;
  } catch (err) {
    console.error(`Error while creating database ${pg_store_db}. ${err}`);
    return false;
  }
};

const create_test_db = async (r_client: Pool, t_client: Pool) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const r_conn = await r_client.connect();
    await r_conn.query(`CREATE DATABASE ${pg_store_test_db}`);
    r_conn.release();

    const t_conn = await t_client.connect();
    await t_conn.query(`GRANT ALL PRIVILEGES ON DATABASE ${pg_store_test_db} TO ${pg_store_user}`);
    await t_conn.query(`GRANT ALL PRIVILEGES ON SCHEMA public TO ${pg_store_user}`);
    t_conn.release();

    return true;
  } catch (err) {
    console.error(`Error while creating database ${pg_store_test_db}. ${err}`);
    return false;
  }
};

const initialize_dbs = async () => {
  await create_user(root_client).then((result) => {
    if (result) {
      console.log(`user created: ${pg_store_user}`);
    }
  });

  await create_dev_db(root_client, dev_client).then((result) => {
    if (result) {
      console.log(`Database created: ${pg_store_db}`);
    }
  });

  await create_test_db(root_client, test_client).then((result) => {
    if (result) {
      console.log(`Database created: ${pg_store_test_db}`);
    }
  });

  root_client.end();
  dev_client.end();
  test_client.end();
};

initialize_dbs();

export default initialize_dbs;
