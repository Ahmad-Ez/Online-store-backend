import { User, UserHashed, UserClass } from '../models/user';
// import supertest from 'supertest';
// import app from '../server';
// import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../config/config';

const { pepper, salt_rounds } = config;

const store = new UserClass();

const u: User = {
  first_name: 'mock_f_name',
  last_name: 'mock_l_name',
  user_name: 'mock_u_name',
  password: 'mock_pass',
};

const pass_hash = bcrypt.hashSync(u.password + pepper, salt_rounds);

const hashed_u: UserHashed = {
  id: 1,
  first_name: 'mock_f_name',
  last_name: 'mock_l_name',
  user_name: 'mock_u_name',
  password_digest: pass_hash,
};

xdescribe('User Model Methods:', () => {
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
    expect(result).toEqual(hashed_u);
  });

  it('index method should return a list of users', async () => {
    const result = await store.index();
    expect(result).toEqual([hashed_u]);
  });

  it('show method should return the correct user', async () => {
    const result = await store.show(hashed_u.user_name);
    expect(result).toEqual(hashed_u);
  });

  it('delete method should remove the user', async () => {
    await store.delete(u.user_name);
    const result = await store.index();
    expect(result).toEqual([]);
  });
});
