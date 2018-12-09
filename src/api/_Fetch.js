export default class _Fetch {
  constructor () {
    this.opts = {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': '*/*'
      },
      timeout: 100000,
      method: 'GET',
      mode: 'no-cors',
      credentials: 'include',
      cache: 'no-cache'
    }
  }

  checkStatus (response) {
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      var error = new Error(response.statusText)
      error.response = response
      throw error
    }
  }

  timeout (to) {
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        reject(new Error('fetch timeout'))
      }, to)
    })
  }

  getUrl (url, data) {
    let q = Object.keys(data).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&')

    return q.length > 0 ? url + '?' + q : url
  }
  // fixme improve code
  getBodyData (data) {
    let q = Object.keys(data).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&')
    return q
  }

  getOpts (opts) {
    let _opts = Object.assign({}, this.opts)
    for (let k in opts) {
      _opts[k] = opts[k]
    }
    return _opts
  }

  // get请求
  get (url, data = {}, opts = {}) {
    let _opts = this.getOpts(opts)
    _opts.method = 'GET'
    let _url = this.getUrl(url, data)

    return Promise.race([
      fetch(_url, _opts),
      this.timeout(_opts.timeout)
    ]).then(this.checkStatus)
  }

  // get请求
  getJson (url, data = {}, opts = {}) {
    let _opts = this.getOpts(opts)
    _opts.method = 'GET'
    let _url = this.getUrl(url, data)

    return Promise.race([
      fetch(_url, _opts),
      this.timeout(_opts.timeout)
    ]).then(this.checkStatus)
      .then(function (response) {
        return response.json()
      })
  }

  // post请求
  postJson (url, data = {}, opts = {}) {
    let _opts = this.getOpts(opts)
    let _data = this.getBodyData(data)
    _opts.method = 'POST'
    _opts.body = _data

    return Promise.race([
      fetch(url, _opts),
      this.timeout(_opts.timeout)
    ]).then(this.checkStatus)
      .then(function (response) {
        return response.json()
      })
  }

  // post请求
  post (url, data = {}, opts = {}) {
    let _opts = this.getOpts(opts)
    let _data = JSON.stringify(data)
    _opts.method = 'POST'
    _opts.body = _data

    return Promise.race([
      fetch(url, _opts),
      this.timeout(_opts.timeout)
    ]).then(this.checkStatus)
  }
}
