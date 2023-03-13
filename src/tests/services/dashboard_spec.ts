import { DashboardQueries } from '../../services/dashboard';
import { OrderClass } from '../../models/order';
import { User, UserHashed, UserClass } from '../../models/user';
import bcrypt from 'bcrypt';

const pepper = process.env.BCRYPT_PASSWORD;
const salt_rounds: string = <string>process.env.SALT_ROUNDS;

const dash_store = new DashboardQueries();
const order_store = new OrderClass();
const user_store = new UserClass();

const u_in: User = {
  first_name: 'mock_f_name',
  last_name: 'mock_l_name',
  user_name: 'mock_u_name',
  password: 'mock_pass',
};

const pass_hash = bcrypt.hashSync(u_in.password + pepper, parseInt(salt_rounds));

const u_hashed: UserHashed = {
  id: 1,
  first_name: 'mock_f_name',
  last_name: 'mock_l_name',
  user_name: 'mock_u_name',
  password_digest: pass_hash,
};

describe('Order Model', () => {
  it('should have a user_active_order method', () => {
    expect(dash_store.user_active_order).toBeDefined();
  });

  it('should have a user_completed_orders method', () => {
    expect(dash_store.user_completed_orders).toBeDefined();
  });

  it('add a mock user first for testing', async () => {
    const result = await user_store.create(u_in);
    expect(result).toEqual(u_hashed);
  });

  it('Create an active order first for testing', async () => {
    const result = await order_store.create({
      status: 'active',
      user_id: '1',
    });
    expect(result).toEqual({
      id: 1,
      status: 'active',
      user_id: '1',
    });
  });

  it('Create a complete order first for testing', async () => {
    const result = await order_store.create({
      status: 'complete',
      user_id: '1',
    });
    expect(result).toEqual({
      id: '2',
      status: 'complete',
      user_id: '1',
    });
  });

  it('user_active_order method should return the active order', async () => {
    const result = await dash_store.user_active_order(1);
    expect(result).toEqual([
      {
        id: 1,
        status: 'active',
        user_id: '1',
      },
    ]);
  });

  it('user_completed_orders method should return the active order', async () => {
    const result = await dash_store.user_completed_orders(1);
    expect(result).toEqual([
      {
        id: '2',
        status: 'complete',
        user_id: '1',
      },
    ]);
  });

  it('delete the mock orders', async () => {
    await order_store.delete(1);
    await order_store.delete('2');
    const result = await order_store.index();
    expect(result).toEqual([]);
  });

  it('delete the mock user', async () => {
    await user_store.delete(u_in.user_name);
    const result = await user_store.index();
    expect(result).toEqual([]);
  });
});
