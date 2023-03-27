import express from 'express';
import userRoutes from './api/users';
import productRoutes from './api/products';
import orderRoutes from './api/orders';
import dashboardRoutes from './api/dashboards';

const routes = express.Router();
routes.get('/', (req, res) => {
  res.send('main API route');
});

routes.use('/users', userRoutes);
routes.use('/products', productRoutes);
routes.use('/orders', orderRoutes);
routes.use('/dashboard', dashboardRoutes);

export default routes;
