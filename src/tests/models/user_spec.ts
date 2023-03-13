import { User, UserHashed, UserClass } from '../../models/user';
import client from '../../database';
import bcrypt from 'bcrypt';

const pepper = process.env.BCRYPT_PASSWORD;
const salt_rounds: string = <string>process.env.SALT_ROUNDS;

const store = new UserClass();

const u: User = {
  first_name: 'mock_f_name',
  last_name: 'mock_l_name',
  user_name: 'mock_u_name',
  password: 'mock_pass',
};

const pass_hash = bcrypt.hashSync(u.password + pepper, parseInt(salt_rounds));

const u_hashed: UserHashed = {
  id: 1,
  first_name: 'mock_f_name',
  last_name: 'mock_l_name',
  user_name: 'mock_u_name',
  password_digest: pass_hash,
};

describe('User Model Methods:', () => {
  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const conn = await client.connect();
    await conn.query('DELETE FROM users');
    await conn.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    conn.release();
  });

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('create method should add a user', async () => {
    const result = await store.create(u);
    expect(result).toEqual(u_hashed);
  });

  it('index method should return a list of users', async () => {
    const result = await store.index();
    expect(result).toEqual([u_hashed]);
  });

  it('show method should return the correct user', async () => {
    const result = await store.show(<number>u_hashed.id);
    expect(result).toEqual(u_hashed);
  });

  it('delete method should remove the user', async () => {
    await store.delete(u.user_name);
    const result = await store.index();
    expect(result).toEqual([]);
  });
});
