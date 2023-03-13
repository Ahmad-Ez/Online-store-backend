import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

xdescribe('Test the routes in the orders handler', () => {
  it('checking the index route', async () => {
    const response = await request.get('/orders');
    expect(response.status).toBe(200);
  });
});
