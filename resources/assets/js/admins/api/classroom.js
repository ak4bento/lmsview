import Api from './Api';

class Classroom extends Api {
  constructor() {
    super('/api/classroom');
  }
}

export default new Classroom;
