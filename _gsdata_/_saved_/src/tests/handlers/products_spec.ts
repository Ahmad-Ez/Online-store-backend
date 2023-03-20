import supertest from 'supertest';
import app from '../../server';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user';
import { Product } from '../../models/product';
import config from '../../config/config';

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

xdescribe('Product Routes:', () => {
  it('should not create a product with out token verification', async () => {
    const response = await request.post('/products').send(p);
    expect(response.status).toBe(401);
  });

  it('should create a product via, POST /products', async () => {
    const response = await request.post('/products').send(p).set(auth_header);
    expect(response.status).toBe(200);
  });

  it('should index all products via, GET /products', async () => {
    const response = await request.get('/products');
    expect(response.status).toBe(200);
  });

  it('should show a product via, GET /products/id/:id', async () => {
    const response = await request.get('/products/id/1');
    expect(response.status).toBe(200);
  });

  it('should show a product category via, GET /products/cat/:category', async () => {
    const response = await request.get(`/products/cat/${p.category}`);
    expect(response.status).toBe(200);
  });

  it('should delete a product via, DELETE /products', async () => {
    const response = await request.delete('/products').send({ id: 1 }).set(auth_header);
    expect(response.status).toBe(200);
  });
});
