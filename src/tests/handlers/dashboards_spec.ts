import supertest from 'supertest';
import app from '../../server';
import jwt from 'jsonwebtoken';
import { Order, OrderClass } from '../../models/order';
import { User, UserHashed, UserClass } from '../../models/user';
import bcrypt from 'bcrypt';
import config from '../../config/config';
import client from '../../database';

const { jwt_secret, pepper } = config;

const order_store = new OrderClass();
const user_store = new UserClass();

const request = supertest(app);

const u: User = {
  first_name: 'u_f_name',
  last_name: 'u_l_name',
  user_name: 'u_u_name',
  password: 'u_pass',
};

let u_hashed: UserHashed;

const active_in: Order = {
  status: 'active',
  user_id: '1',
};

const active_out: Order = {
  id: 1,
  status: 'active',
  user_id: '1',
};

const complete_in: Order = {
  status: 'complete',
  user_id: '1',
};

const complete_out: Order = {
  id: 2,
  status: 'complete',
  user_id: '1',
};

const compare_u2uh = (u: User, uh: UserHashed): boolean => {
  let same;
  if (
    (u.first_name, u.last_name, u.user_name) === (uh.first_name, uh.last_name, uh.user_name) &&
    bcrypt.compareSync(u.password + pepper, uh.password_digest)
  ) {
    same = true;
  } else {
    same = false;
  }
  return same;
};

const token = jwt.sign(u, jwt_secret);
const auth_header = { Authorization: `Bearer ${token}` };

describe('Dashboard Routes:', () => {
  beforeAll(async () => {
    // Reset the tables in the test database
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const conn = await client.connect();
    await conn.query('DELETE FROM users');
    await conn.query('DELETE FROM products');
    await conn.query('DELETE FROM orders');
    await conn.query('DELETE FROM order_products');
    await conn.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await conn.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
    await conn.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1');
    await conn.query('ALTER SEQUENCE order_products_id_seq RESTART WITH 1');
    conn.release();
  });

  it('adds a mock user first for testing', async () => {
    await user_store.create(u);
    u_hashed = await user_store.authenticate(u.user_name, u.password);
    expect(compare_u2uh(u, u_hashed)).toBeTrue;
  });

  it('creates an active order first for testing', async () => {
    const result = await order_store.create(active_in);
    expect(result).toEqual(active_out);
  });

  it('creates a complete order first for testing', async () => {
    const result = await order_store.create(complete_in);
    expect(result).toEqual(complete_out);
  });

  it('should not return the active order for a given user without token verification', async () => {
    const response = await request.get('/api/dashboard/user_active_order/1');
    expect(response.status).toBe(401);
  });

  it('should return the active order for a given user via: GET /user_active_order/:id', async () => {
    const response = await request.get('/api/dashboard/user_active_order/1').set(auth_header);
    expect(response.status).toBe(200);
  });

  it('should not return the completed order for a given user without token verification', async () => {
    const response = await request.get('/api/dashboard/user_completed_orders/1');
    expect(response.status).toBe(401);
  });

  it('should return the completed order for a given user via: GET /user_completed_orders/:id', async () => {
    const response = await request.get('/api/dashboard/user_completed_orders/1').set(auth_header);
    expect(response.status).toBe(200);
  });

  it('deletes the mock orders', async () => {
    await order_store.delete(1);
    await order_store.delete(2);
    const result = await order_store.index();
    expect(result).toEqual([]);
  });

  it('deletes the mock user', async () => {
    await user_store.delete(u.user_name);
    const result = await user_store.index();
    expect(result).toEqual([]);
  });
});
