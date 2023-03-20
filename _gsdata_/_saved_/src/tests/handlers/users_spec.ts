import supertest from 'supertest';
import app from '../../server';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user';
import config from '../../config/config';

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

xdescribe('User Routes:', () => {
  it('should not create a user with out token verification', async () => {
    const response = await request.post('/users').send(user);
    expect(response.status).toBe(401);
  });

  it('should create a user via, POST /users', async () => {
    const response = await request.post('/users').send(user).set(auth_header);
    expect(response.status).toBe(200);
  });

  it('should index all users via, GET /users', async () => {
    const response = await request.get('/users').set(auth_header);
    expect(response.status).toBe(200);
  });

  it('should show a user via, GET /users/:id', async () => {
    const response = await request.get('/users/route_u_name').set(auth_header);
    expect(response.status).toBe(200);
  });

  it('should delete a user via, DELETE /users', async () => {
    const response = await request.delete('/users').send({ id: 1 }).set(auth_header);
    expect(response.status).toBe(200);
  });
});
