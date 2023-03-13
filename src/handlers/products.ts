import express, { Request, Response } from 'express';
import { Product, ProductClass } from '../models/product';
import verifyAuthToken from '../utils/auth';

const store = new ProductClass();

const index = async (_req: Request, res: Response) => {
  console.log('index invoked');

  const products = await store.index();
  res.json(products);
};

const show = async (req: Request, res: Response) => {
  const product = await store.show(parseInt(req.params.id));
  res.json(product);
};

const show_category = async (req: Request, res: Response) => {
  const products = await store.show_category(req.params.category);
  res.json(products);
};

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

const remove_item = async (req: Request, res: Response) => {
  const deleted = await store.delete(req.body.id);
  res.json(deleted);
};

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/id/:id', show); // added the id part to avoid confusion with category route
  app.get('/products/cat/:category', show_category);
  app.post('/products', verifyAuthToken, create);
  app.delete('/products', verifyAuthToken, remove_item);
};

export default productRoutes;
