import supertest from 'supertest';
import app from '../../server';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user';

const request = supertest(app);

const user: User = {
  first_name: 'route_f_name',
  last_name: 'route_l_name',
  user_name: 'route_u_name',
  password: 'route_pass',
};

const token_secret: string = <string>process.env.TOKEN_SECRET;
const token = jwt.sign(user, token_secret);
const auth_header = { Authorization: `Bearer ${token}` };

console.log(auth_header);

xdescribe('Test the routes in the users handler:', () => {
  beforeAll(() => {
    // jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  it('user create route, POST /users', async () => {
    const response = await request.post('/users').send(user).set(auth_header);
    expect(response.status).toBe(200);
  });

  it('user index route, GET /users', async () => {
    const response = await request.get('/users');
    expect(response.status).toBe(200);
  });

  it('user show route, GET /users/:id', async () => {
    const response = await request.get('/users/1').set(auth_header);
    expect(response.status).toBe(200);
  });

  it('user delete route, DELETE /users', async () => {
    const response = await request.delete('/users').send({ id: 1 }).set(auth_header);
    expect(response.status).toBe(200);
  });
});
