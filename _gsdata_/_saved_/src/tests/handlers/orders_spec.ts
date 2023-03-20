import supertest from 'supertest';
import app from '../../server';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user';
import { Order, OrderProduct } from '../../models/order';

import config from '../../config/config';

const { jwt_secret } = config;

const request = supertest(app);

const u: User = {
  first_name: 'u_f_name',
  last_name: 'u_l_name',
  user_name: 'u_u_name',
  password: 'u_pass',
};

const o: Order = {
  status: 'active',
  user_id: '1',
};

const op: OrderProduct = {
  order_id: '1',
  product_id: '1',
  quantity: 5,
};

const token = jwt.sign(u, jwt_secret);
const auth_header = { Authorization: `Bearer ${token}` };

fdescribe('Order Routes:', () => {
  it('should not create an order without token verification', async () => {
    const response = await request.post('/orders').send(o);
    expect(response.status).toBe(401);
  });

  it('should create an order via, POST /orders', async () => {
    const response = await request.post('/orders').send(o).set(auth_header);
    expect(response.status).toBe(200);
  });

  it('should not index all orders without token verification', async () => {
    const response = await request.get('/orders');
    expect(response.status).toBe(401);
  });

  it('should index all orders via, GET /orders', async () => {
    const response = await request.get('/orders').set(auth_header);
    expect(response.status).toBe(200);
  });

  it('should not show an order without token verification', async () => {
    const response = await request.get('/orders/1');
    expect(response.status).toBe(401);
  });

  it('should show an order via, GET /orders/:id', async () => {
    const response = await request.get('/orders/1').set(auth_header);
    expect(response.status).toBe(200);
  });

  it('should not create an order_product without token verification', async () => {
    const response = await request.post('/order/1/products').send(op);
    expect(response.status).toBe(401);
  });

  it('should create an order_product via, POST /order/:id/products', async () => {
    const response = await request.post('/order/1/products').send(op).set(auth_header);
    expect(response.status).toBe(200);
  });

  it('should not delete an order_product without token verification', async () => {
    const response = await request.delete('/order_product').send({ id: 1 });
    expect(response.status).toBe(401);
  });

  it('should delete an order_product via, DELETE /orders', async () => {
    const response = await request.delete('/order_product').send({ id: 1 }).set(auth_header);
    expect(response.status).toBe(200);
  });

  it('should not delete an order without token verification', async () => {
    const response = await request.delete('/orders').send({ id: 1 });
    expect(response.status).toBe(401);
  });
  it('should delete an order via, DELETE /orders', async () => {
    const response = await request.delete('/orders').send({ id: 1 }).set(auth_header);
    expect(response.status).toBe(200);
  });
});
