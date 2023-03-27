import supertest from 'supertest';
import app from '../../server';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user';
import config from '../../config/config';
import client from '../../database';

const { jwt_secret } = config;

const request = supertest(app);

const user: User = {
  first_name: 'route_f_name',
  last_name: 'route_l_name',
  user_name: 'route_u_name',
  password: 'route_pass',
};

const token = jwt.sign(user, jwt_secret);
const auth_header = { Authorization: `Bearer ${token}` };

describe('User Routes:', () => {
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

  it('should not create a user with out token verification', async () => {
    const response = await request.post('/api/users').send(user);
    expect(response.status).toBe(401);
  });

  it('should create a user via, POST /api/users', async () => {
    const response = await request.post('/api/users').send(user).set(auth_header);
    expect(response.status).toBe(200);
  });

  it('should index all users via, GET /api/users', async () => {
    const response = await request.get('/api/users').set(auth_header);
    expect(response.status).toBe(200);
  });

  it('should show a user via, GET /api/users/:id', async () => {
    const response = await request.get('/api/users/route_u_name').set(auth_header);
    expect(response.status).toBe(200);
  });

  it('should delete a user via, DELETE /api/users', async () => {
    const response = await request.delete('/api/users').send({ id: 1 }).set(auth_header);
    expect(response.status).toBe(200);
  });
});
