// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import client from '../database';

export type Order = {
  id?: number;
  status: string;
  user_id: string;
};
export type OrderProduct = {
  id?: number;
  order_id: string;
  product_id: string;
  quantity: number;
};

export class OrderClass {
  // method to get all orders
  async index(): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

  // method to show single order based on its id
  async show(id: number): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    }
  }

  // method to create a new order
  async create(o: Order): Promise<Order> {
    try {
      const sql = 'INSERT INTO orders (status, user_id) VALUES ($1, $2) RETURNING *';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [o.status, o.user_id]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not add new order for user ${o.user_id}. Error: ${err}`);
    }
  }

  // method to delete an order given its id
  async delete(id: number): Promise<Order> {
    try {
      const sql = 'DELETE FROM orders WHERE id=($1)';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`);
    }
  }

  // method to add new products to an existing 'active' order
  async add_product(op: OrderProduct): Promise<OrderProduct> {
    try {
      // get order to see if it is open
      const order_store = new OrderClass();
      const order = await order_store.show(parseInt(op.order_id));
      if (order.status !== 'active') {
        throw new Error(
          `Could not add product ${op.product_id} to order ${op.order_id} because order status is ${order.status}`
        );
      }
    } catch (err) {
      throw new Error(`${err}`);
    }

    try {
      const sql =
        'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [op.order_id, op.product_id, op.quantity]);
      const order_product = result.rows[0];
      conn.release();
      return order_product;
    } catch (err) {
      throw new Error(`Could not add product ${op.product_id} to order ${op.order_id}: ${err}`);
    }
  }

  // method to get an order_product given its id
  // for internal testing, not exposed in the API routes
  async get_product(id: number): Promise<OrderProduct> {
    try {
      const sql = 'SELECT * FROM order_products WHERE id=($1)';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      const order_product = result.rows[0];
      conn.release();
      return order_product;
    } catch (err) {
      throw new Error(`Could not get order_product ${id}. Error: ${err}`);
    }
  }

  // method to delete an order_product given its id
  async remove_product(id: number): Promise<OrderProduct> {
    try {
      const sql = 'DELETE FROM order_products WHERE id=($1)';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      const order_product = result.rows[0];
      conn.release();
      return order_product;
    } catch (err) {
      throw new Error(`Could not delete order_product ${id}. Error: ${err}`);
    }
  }
}
