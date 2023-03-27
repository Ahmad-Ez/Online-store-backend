import { Product, ProductClass } from '../../models/product';
import client from '../../database';

const store = new ProductClass();

const p_in: Product = {
  product_name: 'pears',
  price: 10.25,
  category: 'fruit',
};
const p_out: Product = {
  id: 1,
  product_name: 'pears',
  price: 10.25,
  category: 'fruit',
};

describe('Product Model Structure', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a show_category method', () => {
    expect(store.show_category).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });
});

describe('Product Model Functionality', () => {
  beforeAll(async () => {
    // Reset the tables in the test database
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const conn = await client.connect();
    await conn.query('DELETE FROM users');
    await conn.query('DELETE FROM products');
    await conn.query('DELETE FROM orders');
    await conn.query('DELETE FROM order_products');
    await conn.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await conn.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
    await conn.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1');
    await conn.query('ALTER SEQUENCE order_products_id_seq RESTART WITH 1');
    conn.release();
  });

  it('create method should add a product', async () => {
    const result = await store.create(p_in);
    expect(result).toEqual(p_out);
  });

  it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(result).toEqual([p_out]);
  });

  it('show method should return the correct product', async () => {
    const result = await store.show(1);
    expect(result).toEqual(p_out);
  });

  it('show_category method should return the correct product', async () => {
    const result = await store.show_category('fruit');
    expect(result).toEqual(p_out);
  });

  it('delete method should remove the product', async () => {
    await store.delete(1);
    const result = await store.index();
    expect(result).toEqual([]);
  });
});
