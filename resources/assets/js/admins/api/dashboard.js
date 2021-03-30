import Api from './Api';

class Dashboard extends Api {
  constructor() {
    super('/rest/dashboard');
  } 
}

export default new Dashboard;