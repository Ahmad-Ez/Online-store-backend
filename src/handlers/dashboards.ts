import express, { Request, Response } from 'express';
import { DashboardQueries } from '../services/dashboard';
import verifyAuthToken from '../utils/auth';

const dashboard = new DashboardQueries();

// Current order with the status 'active' for a given user
const user_active_order = async (req: Request, res: Response) => {
  const order = await dashboard.user_active_order(parseInt(req.params.id));
  res.json(order);
};

// Completed orders with the status 'complete' for a given user
const user_completed_orders = async (req: Request, res: Response) => {
  const order = await dashboard.user_completed_orders(parseInt(req.params.id));
  res.json(order);
};

// routes to operations involving custom queries
const dashboardRoutes = (app: express.Application) => {
  app.get('/user_active_order/:id', verifyAuthToken, user_active_order);
  app.get('/user_completed_orders/:id', verifyAuthToken, user_completed_orders);
};

export default dashboardRoutes;
