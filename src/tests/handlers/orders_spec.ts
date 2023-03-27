import supertest from 'supertest';
import app from '../../server';
import jwt from 'jsonwebtoken';
import { Order, OrderProduct } from '../../models/order';
import { User, UserHashed, UserClass } from '../../models/user';
import { Product, ProductClass } from '../../models/product';
import bcrypt from 'bcrypt';
import config from '../../config/config';
import client from '../../database';

const { jwt_secret } = config;
const { pepper } = config;

const user_store = new UserClass();
const product_store = new ProductClass();

const request = supertest(app);

const u: User = {
  first_name: 'u_f_name',
  last_name: 'u_l_name',
  user_name: 'u_u_name',
  password: 'u_pass',
};

let u_hashed: UserHashed;

const o: Order = {
  status: 'active',
  user_id: '1',
};

const op: OrderProduct = {
  order_id: '1',
  product_id: '1',
  quantity: 5,
};

const p_in: Product = {
  product_name: 'pears',
  price: 10,
  category: 'fruit',
};
const p_out: Product = {
  id: 1,
  product_name: 'pears',
  price: 10,
  category: 'fruit',
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

describe('Order Routes:', () => {
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

  it('add a mock product first for testing', async () => {
    const result = await product_store.create(p_in);
    expect(result).toEqual(p_out);
  });

  it('should not create an order without token verification', async () => {
    const response = await request.post('/api/orders').send(o);
    expect(response.status).toBe(401);
  });

  it('should create an order via, POST /api/orders', async () => {
    const response = await request.post('/api/orders').send(o).set(auth_header);
    expect(response.status).toBe(200);
  });

  it('should not index all orders without token verification', async () => {
    const response = await request.get('/api/orders');
    expect(response.status).toBe(401);
  });

  it('should index all orders via, GET /api/orders', async () => {
    const response = await request.get('/api/orders').set(auth_header);
    expect(response.status).toBe(200);
  });

  it('should not show an order without token verification', async () => {
    const response = await request.get('/api/orders/id/1');
    expect(response.status).toBe(401);
  });

  it('should show an order via, GET /api/orders/:id', async () => {
    const response = await request.get('/api/orders/id/1').set(auth_header);
    expect(response.status).toBe(200);
  });

  it('should not create an order_product without token verification', async () => {
    const response = await request.post('/api/orders/product').send(op);
    expect(response.status).toBe(401);
  });

  it('should create an order_product via, POST /api/orders/product', async () => {
    const response = await request.post('/api/orders/product').send(op).set(auth_header);
    expect(response.status).toBe(200);
  });

  it('should not delete an order_product without token verification', async () => {
    const response = await request.delete('/api/orders/product').send({ id: 1 });
    expect(response.status).toBe(401);
  });

  it('should delete an order_product via, DELETE /api/orders/product', async () => {
    const response = await request.delete('/api/orders/product').send({ id: 1 }).set(auth_header);
    expect(response.status).toBe(200);
  });

  it('should not delete an order without token verification', async () => {
    const response = await request.delete('/api/orders').send({ id: 1 });
    expect(response.status).toBe(401);
  });

  it('should delete an order via, DELETE /api/orders', async () => {
    const response = await request.delete('/api/orders').send({ id: 1 }).set(auth_header);
    expect(response.status).toBe(200);
  });

  it('delete the mock product', async () => {
    await product_store.delete(1);
    const result = await product_store.index();
    expect(result).toEqual([]);
  });

  it('delete the mock user', async () => {
    await user_store.delete(u.user_name);
    const result = await user_store.index();
    expect(result).toEqual([]);
  });
});
