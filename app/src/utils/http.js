import Dialog from "./dialog";

/**
 * Http类，处理请求
 */
export default class Http {
  static STATUS_INVALID_URL = -999901;
  static STATUS_404 = -999902;
  static STATUS_500 = -999903;
  static STATUS_TIMEOUT = -999904;

  /**
   * 获取服务地址
   */
  static getSvr() {
    return "http://localhost:3000/";
    return location.origin;
  }

  constructor() {
    this.get = this.get.bind(this);
    this.getSlim = this.getSlim.bind(this);
    this.cancel = this.cancel.bind(this);

    this._timeout = this._timeout.bind(this);
    this._buildResult = this._buildResult.bind(this);

    this._canceled = false;
  }

  /**
   * 包装超时逻辑
   * @param {Promise} requestPromise 请求Promise对象
   */
  _timeout(requestPromise) {
    let timeoutId = -1,
      timeoutHandler = null,
      timeoutPromise = new Promise((resolve, reject) => {
        timeoutHandler = () =>
          resolve({
            Status: Http.STATUS_TIMEOUT,
            Message: "request timeout."
          });
      });

    timeoutId = setTimeout(() => {
      timeoutHandler && timeoutHandler();
    }, 30 * 1000);

    return Promise.race([requestPromise, timeoutPromise]).then(result => {
      timeoutId && clearTimeout(timeoutId);
      return result;
    });
  }

  /**
   * 生成响应结果
   * @param {int} status 响应状态
   * @param {string} message 响应消息
   * @param {object} data 响应数据
   */
  _buildResult(status, message, data) {
    return {
      Status: status,
      Message: message,
      Data: data
    };
  }

  /**
   * GET请求
   * @param {string} url 地址
   */
  async get(url) {
    let regExp = /^(https|http):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;
    if (!regExp.test(url)) {
      return this._buildResult(
        Http.STATUS_INVALID_URL,
        `The url(${url}) was invalid.`
      );
    }

    return this._timeout(
      fetch(url, { method: "GET" }).then(response => {
        if (response.status == 404) {
          return this._buildResult(
            Http.STATUS_404,
            `The url(${url}) was not found.`
          );
        }
        if (response.status >= 500) {
          return this._buildResult(Http.STATUS_500, `The server had an error.`);
        }
        return response.text().then(data => this._buildResult(0, null, data));
      })
    );
  }

  /**
   * GET请求精简版，对响应结果做了一些校验处理
   * @param {string} route 相对路由
   */
  async getSlim(route) {
    let rejectReason = "",
      svr = Http.getSvr(),
      url = "",
      result = null;

    try {
      if (!/\/$/.test(svr) && !/^\//.test(route)) {
        url = `${svr}/${route}`;
      } else {
        url = svr + route;
      }
      result = await this.get(url);
      console.log(url, result);

      if (result) {
        let { Status: status, Message: message } = result;
        switch (+status) {
          case 0:
            return result;
          case Http.STATUS_INVALID_URL:
            rejectReason = "请求地址无效";
            break;
          case Http.STATUS_TIMEOUT:
            rejectReason = "请求已超时";
            Dialog(rejectReason);
            break;
          case Http.STATUS_404:
            rejectReason = "请求资源不存在";
            Dialog(rejectReason);
            break;
          case Http.STATUS_500:
            rejectReason = "服务器出错了";
            Dialog(rejectReason);
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

  /**
   * 取消该Http实例中的所有请求
   */
  cancel() {
    this._canceled = true;
  }
}
