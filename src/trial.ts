// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Client from '../database';

// contains raw input from the user
type User = {
  id?: string;
  first_name: string;
  last_name: string;
  user_name: string;
  password: string;
};

const u: User = {
  first_name: 'ahmad',
  last_name: 'string',
  user_name: 'string',
  password: 'string',
};

const query = async (u: User) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const conn = await Client.connect();
  const sql1 = 'SELECT exists (SELECT 1 FROM users WHERE user_name = ($1) LIMIT 1)';

  const exists = await conn.query(sql1, [u.user_name]);
  console.log(`exists = ${exists}`);

  if (exists.rows[0] == 'f') {
    throw new Error(`Cannot add user (${u.user_name}, it already exists)`);
  }
  conn.release();
};

console.log('starting trial');

query(u);
