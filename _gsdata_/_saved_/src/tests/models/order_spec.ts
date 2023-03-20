import { Order, OrderProduct, OrderClass } from '../../models/order';
import { User, UserHashed, UserClass } from '../../models/user';
import { Product, ProductClass } from '../../models/product';
import bcrypt from 'bcrypt';
import config from '../../config/config';

const { pepper } = config;

const order_store = new OrderClass();
const user_store = new UserClass();
const product_store = new ProductClass();

const u: User = {
  first_name: 'mock_f_name',
  last_name: 'mock_l_name',
  user_name: 'mock_u_name',
  password: 'mock_pass',
};

let u_hashed: UserHashed;

const p_in: Product = {
  product_name: 'pears',
  price: 10,
  category: 'fruit',
};
const p_out: Product = {
  id: 1,
  product_name: 'pears',
  price: 10,
  category: 'fruit',
};

const o_in: Order = {
  status: 'active',
  user_id: '1',
};

const o_out: Order = {
  id: 1,
  status: 'active',
  user_id: '1',
};

const op_in: OrderProduct = {
  order_id: '1',
  product_id: '1',
  quantity: 5,
};

const op_out: OrderProduct = {
  id: 1,
  order_id: '1',
  product_id: '1',
  quantity: 5,
};

const compare_u2uh = (u: User, uh: UserHashed): boolean => {
  let same;
  if (
    (u.first_name, u.last_name, u.user_name) === (uh.first_name, uh.last_name, uh.user_name) &&
    bcrypt.compareSync(u.password + pepper, uh.password_digest)
  ) {
    same = true;
  } else {
    same = false;
  }
  return same;
};

xdescribe('Order Model Structure: ', () => {
  it('should have an index method', () => {
    expect(order_store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(order_store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(order_store.create).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(order_store.delete).toBeDefined();
  });

  it('should have an add_product method', () => {
    expect(order_store.add_product).toBeDefined();
  });

  it('should have a remove_product method', () => {
    expect(order_store.remove_product).toBeDefined();
  });
});

xdescribe('Order Model Methods, Functionality:', () => {
  it('add a mock user first for testing', async () => {
    await user_store.create(u);
    u_hashed = await user_store.authenticate(u.user_name, u.password);
    expect(compare_u2uh(u, u_hashed)).toBeTrue;
  });

  it('add a mock product first for testing', async () => {
    const result = await product_store.create(p_in);
    expect(result).toEqual(p_out);
  });

  it('create method should add a order', async () => {
    const result = await order_store.create(o_in);
    expect(result).toEqual(o_out);
  });

  it('index method should return a list of orders', async () => {
    const result = await order_store.index();
    expect(result).toEqual([o_out]);
  });

  it('show method should return the correct order', async () => {
    const result = await order_store.show(1);
    expect(result).toEqual(o_out);
  });

  it('add_product method should add a product to an order', async () => {
    const result = await order_store.add_product(op_in);
    expect(result).toEqual(op_out);
  });

  it('get_product method should return the relevant order_product item', async () => {
    const result = await order_store.get_product(1);
    expect(result).toEqual(op_out);
  });

  it('remove_product method should remove the relevant order_product item', async () => {
    await order_store.remove_product(1);
    const result = await order_store.get_product(1);
    expect(result).toBeNull;
  });

  it('delete method should remove the order', async () => {
    await order_store.delete(1);
    const result = await order_store.index();
    expect(result).toEqual([]);
  });

  it('delete the mock user', async () => {
    await user_store.delete(u.user_name);
    const result = await user_store.index();
    expect(result).toEqual([]);
  });
});
