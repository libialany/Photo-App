import { User } from 'src/auth/dto/user-payload.dto';
const getUser = (user) => {
  const newUser = new User();
  newUser.roles = user['roles'];
  newUser.username = user['username'];
  return newUser;
};
export default getUser;
