import express, { Request, Response } from 'express';
import { User, UserClass } from '../models/user';
import verifyAuthToken from '../utils/auth';
import jwt from 'jsonwebtoken';

const token_secret: string = <string>process.env.TOKEN_SECRET;
const store = new UserClass();

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

const show = async (req: Request, res: Response) => {
  console.log('token verified');
  const user = await store.show(parseInt(req.params.id));
  res.json(user);
};

const create = async (req: Request, res: Response) => {
  const user: User = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    user_name: req.body.user_name,
    password: req.body.password,
  };
  try {
    const newUser = await store.create(user);
    const token = jwt.sign({ user: newUser }, token_secret);
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json(<string>err + user);
  }
};

const remove = async (req: Request, res: Response) => {
  const deleted = await store.delete(req.body.user_name);
  res.json(deleted);
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const user: User = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      user_name: req.body.user_name,
      password: req.body.password,
    };
    const hashed_user = await store.authenticate(user.user_name, user.password);
    const token = jwt.sign({ user: hashed_user }, token_secret);
    res.json(token);
  } catch (error) {
    res.status(401);
    res.json({ error });
  }
};

const userRoutes = (app: express.Application) => {
  app.get('/users', index);
  app.get('/users/:id', verifyAuthToken, show);
  app.post('/users', create);
  app.delete('/users', verifyAuthToken, remove);
};

export default userRoutes;
