import Axios from 'axios';

const CancelToken = Axios.CancelToken;

class Api {
  constructor( requestURL ) {
    this.requestURL = requestURL;
  }

  _request({method, url, form, files, params, onProgress}, cb) {
    let totalProgressUpload = 0;
    let totalProgressDownload = 0;
    
    const config = {
      method: method || 'get',
      url: this.requestURL + (url || ""),
      params ,
      onUploadProgress: progressEvent => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        totalProgressUpload = (progress / 100) * 50;

        if (onProgress) onProgress(totalProgressUpload + totalProgressDownload);
      },
      onDownloadProgress: progressEvent => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        totalProgressDownload = (progress / 100) * 50;

        if (onProgress) onProgress(totalProgressUpload + totalProgressDownload);
      }, 
      cancelToken: new CancelToken(c => {
        this.cancelRequest = c;
      })
    };

    if (form || files) {
      const formData = new FormData();

      if (form) {
        Object.keys(form).forEach(key => {
          formData.append(key, form[key]);
        });
      }

      if ( files ) {
        for (var x = 0; x < files.length; x++) {          
          formData.append(files[x].name, files[x].file, files[x].file.name);
        } 
      }

      config.data = formData;
    }

    Axios(config)
    .then(response => {
      if (response.data) cb(response.data, null);
      else cb(null, 'Data empty');
    })
    .catch(error => {
      cb(null, error);
    });
  }

  cancel(){
    if (this.cancelRequest) this.cancelRequest();
  }

  index({ url , params }, cb, onProgress) {
    this._request({
      method: 'get' ,
      params ,
      url ,
      onProgress
    }, cb);
  }

  store({ form , params , files }, cb , onProgress) {
    this._request({
      method: 'post' ,
      params ,
      form ,
      files ,
      onProgress
    }, cb);
  }

  view({ params , id }, cb , onProgress) {
    this._request({
      method: 'get' ,
      params ,
      url: `/${id}` ,
      onProgress
    }, cb);
  }

  update({ form , params , files, id }, cb , onProgress) {
    form['_method'] = 'put';
    this._request({
      method: 'post' ,
      params ,
      form ,
      files ,
      url: `/${id}` ,
      onProgress
    }, cb);
  }

  destroy({ params , id , data}, cb , onProgress) {
    this._request({
      method: 'delete' ,
      params ,
      url: `/${id}` ,
      data: data ,
      onProgress
    }, cb);
  }
}

export default Api;
