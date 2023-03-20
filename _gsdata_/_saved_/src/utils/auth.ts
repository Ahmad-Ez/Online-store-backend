import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const jwt_secret = config.jwt_secret;

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader: string = <string>req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    console.log('Token Verifying..');
    jwt.verify(token, jwt_secret);

    next();
  } catch (error) {
    res.status(401);
    res.json('Access denied, invalid token');
    return;
  }
};
export default verifyAuthToken;
