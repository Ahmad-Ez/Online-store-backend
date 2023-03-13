// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import client from '../database';
import { Order } from '../models/order';

export class DashboardQueries {
  // Get the current active order(s) for user id
  async user_active_order(id: number): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [id, 'active']);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not find active orders for user id: ${id}. Error: ${err}`);
    }
  }

  // Get the completed order(s) for user id
  async user_completed_orders(id: number): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const conn = await client.connect();
      const result = await conn.query(sql, [id, 'complete']);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not find complete orders for user id: ${id}. Error: ${err}`);
    }
  }
}
