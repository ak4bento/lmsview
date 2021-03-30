import Api from './Api';

class Subject extends Api {
  constructor() {
    super('/api/subject');
  }
}

export default new Subject;
