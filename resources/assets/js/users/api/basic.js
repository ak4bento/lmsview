import { get, patch, post } from 'axios';
import axios from 'axios';

export default class BasicApi {

  constructor(requestURL) {
    this.requestURL = requestURL;
  }

  index({ params = {}, cb, err, cancelToken = null }) {
    return get(this.requestURL, {
      params,
      cancelToken
    })
      .then(response => cb && cb(response.data))
      .catch(e => err && err(e));
  }

  show({ id, params = {}, cb, err, cancelToken = null }) {
    return get(this.requestURL + '/' + id, {
      params,
      cancelToken
    })
      .then(response => cb && cb(response.data))
      .catch(e => err && err(e));
  }

  store({ data = {}, params = {}, cb, err, cancelToken = null }) {
    return post(this.requestURL, data, {
      params,
      cancelToken
    })
      .then(response => cb && cb(response.data))
      .catch(e => err && err(e));
  }

  update({ id, data = {}, params = {}, cb, err, cancelToken = null }) {
    return patch(this.requestURL + '/' + id, data, {
      params,
      cancelToken
    })
      .then(response => cb && cb(response.data))
      .catch(e => err && err(e));
  }

  updateMultipartFormData({ id, data = {}, params = {}, cb, err, cancelToken = null }) {
    return post(this.requestURL + '/' + id, data, {
      params,
      cancelToken
    })
      .then(response => cb && cb(response.data))
      .catch(e => err && err(e));
  }

  destroy({ id, params = {}, cancelToken = null, cb, err }) {
    return axios.delete(this.requestURL + '/' + id, { params, cancelToken })
      .then(response => cb && cb(response.data))
      .catch(e => err && err(e));
  }

}