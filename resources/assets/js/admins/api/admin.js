import Api from './Api';

class Admin extends Api {
  constructor() {
    super('/api/admin');
  }
}

export default new Admin;