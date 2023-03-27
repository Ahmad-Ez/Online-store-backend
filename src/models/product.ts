// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import client from '../database';

// The following code block is to prevent product price from being returned as string
import { types } from 'pg';
types.setTypeParser(types.builtins.NUMERIC, function (val) {
  return parseFloat(val);
});

export type Product = {
  id?: number;
  product_name: string;
  price: number;
  category: string;
};

export class ProductClass {
  // method to get all products
  async index(): Promise<Product[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    }
  }

  // method to show a single product based on its id
  async show(id: number): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`);
    }
  }

  // method to show all products in a given category
  async show_category(category: string): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE category=($1)';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [category]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find product ${category}. Error: ${err}`);
    }
  }

  // method to create a new product
  async create(p: Product): Promise<Product> {
    try {
      const sql =
        'INSERT INTO products (product_name, price, category) VALUES ($1, $2, $3) RETURNING *';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [p.product_name, p.price, p.category]);
      const product = result.rows[0];
      conn.release();
      console.log(product);
      console.log(product.price);

      return product;
    } catch (err) {
      throw new Error(`Could not add new product ${p.product_name}. Error: ${err}`);
    }
  }

  // method to delete an product given its id
  async delete(id: number): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1)';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Could not delete product ${id}. Error: ${err}`);
    }
  }
}
