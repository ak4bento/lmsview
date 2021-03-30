import Api from './Api';

class Categories extends Api {
  constructor() {
    super('/rest/category');
  }
}

export default new Categories;