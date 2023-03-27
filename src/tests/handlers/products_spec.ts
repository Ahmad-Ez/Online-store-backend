import supertest from 'supertest';
import app from '../../server';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user';
import { Product } from '../../models/product';
import config from '../../config/config';
import client from '../../database';

const { jwt_secret } = config;

const request = supertest(app);

const u: User = {
  first_name: 'u_f_name',
  last_name: 'u_l_name',
  user_name: 'u_u_name',
  password: 'u_pass',
};

const p: Product = {
  product_name: 'apples',
  price: 40,
  category: 'fruit',
};

const token = jwt.sign(u, jwt_secret);
const auth_header = { Authorization: `Bearer ${token}` };

describe('Product Routes:', () => {
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

  it('should not create a product with out token verification', async () => {
    const response = await request.post('/api/products').send(p);
    expect(response.status).toBe(401);
  });

  it('should create a product via, POST /api/products', async () => {
    const response = await request.post('/api/products').send(p).set(auth_header);
    expect(response.status).toBe(200);
  });

  it('should index all products via, GET /api/products', async () => {
    const response = await request.get('/api/products');
    expect(response.status).toBe(200);
  });

  it('should show a product via, GET /api/products/id/:id', async () => {
    const response = await request.get('/api/products/id/1');
    expect(response.status).toBe(200);
  });

  it('should show a product category via, GET /api/products/cat/:category', async () => {
    const response = await request.get(`/api/products/cat/${p.category}`);
    expect(response.status).toBe(200);
  });

  it('should delete a product via, DELETE /api/products', async () => {
    const response = await request.delete('/api/products').send({ id: 1 }).set(auth_header);
    expect(response.status).toBe(200);
  });
});
