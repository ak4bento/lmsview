import Api from './Api';

class Auth extends Api {
  constructor() {
    super('/logout')
  }
  
  logout(cb, err) {
    this.store({}, (result, errMessage) => {
      if (errMessage) err(errMessage);
      else cb(result);
    });
  }  
}

export default new Auth;