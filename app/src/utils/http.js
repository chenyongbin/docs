export default class Http {
  static STATUS_INVALID_URL = -999901;
  static STATUS_404 = -999902;
  static STATUS_500 = -999903;
  static STATUS_TIMEOUT = -999904;

  constructor() {
    this.get = this.get.bind(this);
    this.getSlim = this.getSlim.bind(this);
    this.cancel = this.cancel.bind(this);

    this._timeout = this._timeout.bind(this);
    this._buildResult = this._buildResult.bind(this);

    this._canceled = false;
  }

  _timeout(requestPromise) {
    return Promise.race([
      requestPromise,
      new Promise((resolve, reject) =>
        setTimeout(reject, 30 * 1000, {
          Status: Http.STATUS_TIMEOUT,
          Message: "request timeout."
        })
      )
    ]);
  }

  _buildResult(status, message, data) {
    return {
      Status: status,
      Message: message,
      Data: data
    };
  }

  async get(url) {
    let regExp = /^(https|http):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;
    if (!regExp.test(url)) {
      return this._buildResult(
        Http.STATUS_INVALID_URL,
        `The url(${url}) was invalid.`
      );
    }

    return this._timeout(
      fetch(url, { method: "GET" })
        .then(response => {
          if (response.status == 404) {
            return this._buildResult(
              Http.STATUS_404,
              `The url(${url}) was not found.`
            );
          }
          if (response.status >= 500) {
            return this._buildResult(
              Http.STATUS_500,
              `The server had an error.`
            );
          }
          return response.text();
        })
        .then(data => this._buildResult(0, null, data))
    );
  }

  async getSlim(path) {
    let rejectReason = "",
      result = null;

    try {
      result = await this.get(`http://localhost:3000/${path}`);
      if (result) {
        let { Status: status, Message: message } = result;
        switch (+status) {
          case 0:
            return result;
            break;
          default:
            rejectReason = message;
            break;
        }
      } else {
        rejectReason = "网络繁忙，请稍后重试！";
      }
    } catch (error) {
      rejectReason = error ? error.message || error : "";
    }
    return Promise.reject(new Error(rejectReason));
  }

  cancel() {
    this._canceled = true;
  }
}
