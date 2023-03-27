import express, { Request, Response } from 'express';
import { Order, OrderProduct, OrderClass } from '../../models/order';
import verifyAuthToken from '../../utils/auth';

const store = new OrderClass();

// get all items
const index = async (_req: Request, res: Response) => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

// show single item based on its id
const show = async (req: Request, res: Response) => {
  try {
    const order = await store.show(parseInt(req.params.id));
    res.json(order);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

// create a new item
const create = async (req: Request, res: Response) => {
  try {
    const order: Order = {
      status: req.body.status,
      user_id: req.body.user_id,
    };
    const new_order = await store.create(order);
    res.json(new_order);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

// delete an item given its id
const remove_order = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(req.body.id);
    res.json(deleted);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

//add new products to an existing 'active' order
const add_product = async (req: Request, res: Response) => {
  try {
    const order_product: OrderProduct = {
      order_id: req.body.order_id,
      product_id: req.body.product_id,
      quantity: req.body.quantity,
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
  try {
    const deleted = await store.remove_product(req.body.id);
    res.json(deleted);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

// routes to operations involving orders
const orderRoutes = express.Router();
orderRoutes.get('/', verifyAuthToken, index);
orderRoutes.get('/id/:id', verifyAuthToken, show);
orderRoutes.post('/', verifyAuthToken, create);
orderRoutes.delete('/', verifyAuthToken, remove_order);
orderRoutes.post('/product', verifyAuthToken, add_product); // removed the s from orders to avoid confusion with show route
orderRoutes.delete('/product', verifyAuthToken, remove_product);

export default orderRoutes;
