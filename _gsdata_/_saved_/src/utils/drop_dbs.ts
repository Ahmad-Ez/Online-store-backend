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
} = config;

const root_client = new Pool({
  host: postgres_host,
  user: pg_root_user,
  database: pg_root_db,
  password: pg_root_pass,
  port: postgres_port,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 3000,
  allowExitOnIdle: true,
});

const drop_dev_db = async (client: Pool) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const conn = await client.connect();
    await conn.query(`DROP DATABASE ${pg_store_db}`);
    conn.release();

    return true;
  } catch (err) {
    // (await client.connect()).release()
    console.error(`Could not delete database ${pg_store_db}. Error: ${err}`);
    return false;
  }
};

const drop_test_db = async (client: Pool) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const conn = await client.connect();
    await conn.query(`DROP DATABASE ${pg_store_test_db}`);
    conn.release();

    return true;
  } catch (err) {
    // (await client.connect()).release();
    console.error(`Could not delete database ${pg_store_test_db}. Error: ${err}`);
    return false;
  }
};

const delete_user = async (client: Pool) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const conn = await client.connect();
    const sql_query = `REVOKE ALL ON SCHEMA public FROM ${pg_store_user};
    REASSIGN OWNED BY ${pg_store_user} TO ${pg_root_user};
    DROP ROLE ${pg_store_user};`;

    await conn.query(sql_query);
    // await conn.query(`REASSIGN OWNED BY ${pg_store_user} TO ${pg_root_user}`);
    // await conn.query(`DROP ROLE ${pg_store_user}`);

    conn.release();
    return true;
  } catch (err) {
    console.error(`Could not delete user ${pg_store_user}. Error: ${err}`);
    (await client.connect()).release();
    // root_client.end()
    return false;
  }
};

const drop_dbs = async () => {
  await drop_dev_db(root_client).then((result) => {
    if (result) {
      console.log(`Database deleted: ${pg_store_db}`);
    }
  });

  await drop_test_db(root_client).then((result) => {
    if (result) {
      console.log(`Database deleted: ${pg_store_test_db}`);
    }
  });

  await delete_user(root_client).then((result) => {
    if (result) {
      console.log(`User deleted: ${pg_store_user}`);
    }
  });

  await root_client.end();
  //   .then(async () => { console.log('finished3') });
};

drop_dbs().then(async () => {
  console.log('finished4');
});

export default drop_dbs;
