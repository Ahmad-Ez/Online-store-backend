// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import client from '../database';
import bcrypt from 'bcrypt';

const pepper = process.env.BCRYPT_PASSWORD;
const salt_rounds: string = <string>process.env.SALT_ROUNDS;

// contains raw input from the user
export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  user_name: string;
  password: string;
};

// contains the hashed info stored in the database
export type UserHashed = {
  id?: number;
  first_name: string;
  last_name: string;
  user_name: string;
  password_digest: string;
};

export class UserClass {
  async index(): Promise<UserHashed[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'SELECT * FROM users';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: number): Promise<UserHashed> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }

  async create(u: User): Promise<UserHashed> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const sql1 = 'SELECT exists (SELECT 1 FROM users WHERE user_name = ($1) LIMIT 1)';

      const exists = await conn.query(sql1, [u.user_name]);
      console.log(`exists = ${exists}`);

      if (exists.rows[0] == 'f') {
        throw new Error(`Cannot add user (${u.user_name}, it already exists)`);
      }
      conn.release();
    } catch (err) {
      throw new Error(`unable create user (${u.user_name} ): ${err}`);
    }

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const hash = bcrypt.hashSync(u.password + pepper, parseInt(salt_rounds));
      const sql =
        'INSERT INTO users (first_name, last_name, user_name, password_digest) VALUES($1, $2, $3, $4) RETURNING *';

      const result = await conn.query(sql, [u.first_name, u.last_name, u.user_name, hash]);
      const user = result.rows[0];

      conn.release();
      return user;
    } catch (err) {
      throw new Error(`unable create user (${u.user_name} ): ${err}`);
    }
  }

  async delete(user_name: string): Promise<UserHashed> {
    try {
      const sql = 'DELETE FROM users WHERE user_name=($1)';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [user_name]);
      const user = result.rows[0];
      conn.release();

      return user;
    } catch (err) {
      throw new Error(`Could not delete user ${user_name}. Error: ${err}`);
    }
  }

  async authenticate(user_name: string, password: string): Promise<User | null> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const conn = await client.connect();
    const sql = 'SELECT * FROM users WHERE user_name=($1)';
    const result = await conn.query(sql, [user_name]);

    console.log(password + pepper);
    if (result.rows.length) {
      const hashed_user = result.rows[0];
      console.log(hashed_user);

      if (bcrypt.compareSync(password + pepper, hashed_user.password_digest)) {
        return hashed_user;
      }
    }

    return null;
  }
}
