import { User, UserHashed, UserClass } from './models/user';
import bcrypt from 'bcrypt';
import config from './config/config';

const { pepper } = config;

const store = new UserClass();

const u: User = {
  first_name: 'ahmad5',
  last_name: 'ez5',
  user_name: 'ahmadez5',
  password: 'pass5',
};

// const uh: UserHashed = {
//   id: 1,
//   first_name: 'mock11_f_name',
//   last_name: 'mock11_l_name',
//   user_name: 'mock11_u_name',
//   password_digest: 'm_pass',
// };

const compare_users = (u: User, uh: UserHashed): boolean => {
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

const start = async () => {
  const uh = await store.create(u);
  console.log(JSON.stringify(uh, null, 2));
  console.log(compare_users(u, uh));
};

start();
// check(u);
