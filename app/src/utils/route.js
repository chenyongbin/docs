let _listening = false,
  _path = "",
  _routes = [],
  _handlers = [];

/**
 * 路由服务类
 */
export default class Route {
  /**
   * 开启路由服务
   */
  static start() {
    if (_listening) {
      return;
    }

    window.onhashchange = ({ newURL, oldURL }) => {
      _path = location.hash;
      _path && (_path = _path.substr(1));
      _routes = _path.split("/");

      for (let handler of _handlers) {
        handler && handler(_routes);
      }
    };
    _listening = true;
  }

  /**
   * 停止路由服务
   */
  static stop() {
    window.onhashchange = null;
    _routes = null;
    _handlers = null;
  }

  /**
   * 订阅路由变化处理器
   * @param {function} handler 路由变化处理器
   */
  static subscribeRouteChange(handler) {
    if (!handler || typeof handler != "function") {
      return;
    }
    _handlers.push(handler);
  }
}
