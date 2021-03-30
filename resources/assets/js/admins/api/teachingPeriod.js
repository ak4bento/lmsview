import Api from './Api';

class TeachingPeriod extends Api {
  constructor() {
    super('/api/teaching-period');
  }
}

export default new TeachingPeriod;
