import Api from './Api';

class User extends Api {
  constructor() {
    super('/api/user');
  }
}

export default new User;
