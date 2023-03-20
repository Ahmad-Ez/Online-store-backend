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
  id: number;
  first_name: string;
  last_name: string;
  user_name: string;
  password_digest: string;
};

export class UserClass {
  // method to get all users
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

  // method to show a single user based on its id
  async show(user_name: string): Promise<UserHashed> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'SELECT * FROM users WHERE user_name=($1)';
      const result = await conn.query(sql, [user_name]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${user_name}. Error: ${err}`);
    }
  }

  // method to create a new user
  async create(u: User): Promise<UserHashed> {
    try {
      const user_store = new UserClass()
      const user_exists = await user_store.show(u.user_name)

      if (user_exists) {
        throw new Error('username already exists, pick a different username');
      }
    } catch (err) {
      throw new Error(`unable create user (${u.user_name}): ${err}`);
    }

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const pass_hash = bcrypt.hashSync(u.password + pepper, parseInt(salt_rounds));
      const sql =
        'INSERT INTO users (first_name, last_name, user_name, password_digest) VALUES($1, $2, $3, $4) RETURNING *';

      const result = await conn.query(sql, [u.first_name, u.last_name, u.user_name, pass_hash]);
      const user = result.rows[0];
      conn.release();

      return user;
    } catch (err) {
      throw new Error(`unable create user (${u.user_name} ): ${err}`);
    }
  }

  // method to delete a user given his/her username
  async delete(user_name: string): Promise<UserHashed> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'DELETE FROM users WHERE user_name=($1)';
      const result = await conn.query(sql, [user_name]);
      const user = result.rows[0];
      conn.release();

      return user;
    } catch (err) {
      throw new Error(`Could not delete user ${user_name}. Error: ${err}`);
    }
  }

  // a method to authenticate a user for an operation requiring elevated access
  async authenticate(user_name: string, password: string): Promise<UserHashed> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'SELECT password_digest FROM users WHERE user_name=($1)';
      const result = await conn.query(sql, [user_name]);

      if (!result.rows.length) {
        throw new Error(`User ${user_name} has no records. Sign up!`);
      }
      const hashed_user: UserHashed = result.rows[0];
      console.log('hashed_user: ' + hashed_user);

      if (!bcrypt.compareSync(password + pepper, hashed_user.password_digest)) {
        throw new Error('Wrong username or password!');
      }
      return hashed_user;
    } catch (err) {
      throw new Error(`Could not delete user ${user_name}. Error: ${err}`);
    }
  }
}
