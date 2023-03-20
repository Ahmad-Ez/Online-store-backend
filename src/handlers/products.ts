import express, { Request, Response } from 'express';
import { Product, ProductClass } from '../models/product';
import verifyAuthToken from '../utils/auth';

const store = new ProductClass();

// get all items
const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

// show single item based on its id
const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(parseInt(req.params.id));
    res.json(product);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

// get all products in a given category
const show_category = async (req: Request, res: Response) => {
  try {
    const products = await store.show_category(req.params.category);
    res.json(products);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

// create a new item
const create = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      product_name: req.body.product_name,
      price: req.body.price,
      category: req.body.category,
    };

    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

// delete an item given its id
const remove = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(req.body.id);
    res.json(deleted);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

// routes to operations involving products
const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/id/:id', show); // added the id part to avoid confusion with category route
  app.get('/products/cat/:category', show_category);
  app.post('/products', verifyAuthToken, create);
  app.delete('/products', verifyAuthToken, remove);
};

export default productRoutes;
