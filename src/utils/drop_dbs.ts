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
} = process.env;

const root_client = new Pool({
  host: POSTGRES_HOST,
  user: PG_ROOT_USER,
  database: PG_ROOT_DB,
  password: PG_ROOT_PASS,
  port: parseInt(<string>POSTGRES_PORT),
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 3000,
  allowExitOnIdle: true,
});

const drop_dev_db = async (client: Pool) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const conn = await client.connect();
    await conn.query(`DROP DATABASE ${PG_STORE_DB}`);
    conn.release();

    return true;
  } catch (err) {
    // (await client.connect()).release()
    console.error(`Could not delete database ${PG_STORE_DB}. Error: ${err}`);
    return false;
  }
};

const drop_test_db = async (client: Pool) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const conn = await client.connect();
    await conn.query(`DROP DATABASE ${PG_STORE_TEST_DB}`);
    conn.release();

    return true;
  } catch (err) {
    // (await client.connect()).release();
    console.error(`Could not delete database ${PG_STORE_TEST_DB}. Error: ${err}`);
    return false;
  }
};

const delete_user = async (client: Pool) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const conn = await client.connect();
    const sql_query = `REVOKE ALL ON SCHEMA public FROM ${PG_STORE_USER};
    REASSIGN OWNED BY ${PG_STORE_USER} TO ${PG_ROOT_USER};
    DROP ROLE ${PG_STORE_USER};`;

    await conn.query(sql_query);
    // await conn.query(`REASSIGN OWNED BY ${PG_STORE_USER} TO ${PG_ROOT_USER}`);
    // await conn.query(`DROP ROLE ${PG_STORE_USER}`);

    conn.release();
    return true;
  } catch (err) {
    console.error(`Could not delete user ${PG_STORE_USER}. Error: ${err}`);
    (await client.connect()).release();
    // root_client.end()
    return false;
  }
};

const drop_dbs = async () => {
  await drop_dev_db(root_client).then((result) => {
    if (result) {
      console.log(`Database deleted: ${PG_STORE_DB}`);
    }
  });

  await drop_test_db(root_client).then((result) => {
    if (result) {
      console.log(`Database deleted: ${PG_STORE_TEST_DB}`);
    }
  });

  await delete_user(root_client).then((result) => {
    if (result) {
      console.log(`User deleted: ${PG_STORE_USER}`);
    }
  });

  await root_client.end();
  //   .then(async () => { console.log('finished3') });
};

drop_dbs().then(async () => {
  console.log('finished4');
});

export default drop_dbs;
