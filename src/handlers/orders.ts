import express, { Request, Response } from 'express';
import { Order, OrderProduct, OrderClass } from '../models/order';
import verifyAuthToken from '../utils/auth';

const store = new OrderClass();

// get all items
const index = async (_req: Request, res: Response) => {
  const orders = await store.index();
  res.json(orders);
};

// show single item based on its id
const show = async (req: Request, res: Response) => {
  const order = await store.show(parseInt(req.params.id));
  res.json(order);
};

// create a new item
const create = async (req: Request, res: Response) => {
  try {
    const order: Order = {
      status: req.body.status,
      user_id: req.body.user_id,
    };
    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

// delete an item given its id
const remove_item = async (req: Request, res: Response) => {
  const deleted = await store.delete(req.body.id);
  res.json(deleted);
};

//add new products to an existing 'active' order
const add_product = async (req: Request, res: Response) => {
  try {
    const order_product: OrderProduct = {
      order_id: req.params.id,
      product_id: req.body.product_id,
      quantity: parseInt(req.body.quantity),
    };
    const addedProduct = await store.add_product(order_product);
    res.json(addedProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

// delete a product in an order given its id, created to help in testing
const remove_product = async (req: Request, res: Response) => {
  const deleted = await store.remove_product(req.body.id);
  res.json(deleted);
};

// routes to operations involving orders
const orderRoutes = (app: express.Application) => {
  app.get('/orders', verifyAuthToken, index);
  app.get('/orders/:id', verifyAuthToken, show);
  app.post('/orders', verifyAuthToken, create);
  app.delete('/orders', verifyAuthToken, remove_item);
  app.post('/order/:id/products', verifyAuthToken, add_product); // removed the s from orders to avoid confusion with show route
  app.delete('/order_product', verifyAuthToken, remove_product); // removed the s from orders to avoid confusion with show route
};

export default orderRoutes;
