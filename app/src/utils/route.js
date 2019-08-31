let _listening = false,
  _absoluteRoute = false,
  _route = "",
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
      _route = location.hash;
      _route && (_route = _route.substr(1));
      _absoluteRoute = /\.(json|md)$/i.test(_route);

      for (let handler of _handlers) {
        try {
          handler && handler(_absoluteRoute, _route);
        } catch (error) {
          console.log(`ROUTE_ONHASHCHANGE_ERROR`, error);
        }
      }
    };
    _listening = true;
  }

  /**
   * 停止路由服务
   */
  static stop() {
    window.onhashchange = null;
    _handlers = null;
  }

  /**
   * 订阅路由变化处理器
   * 处理器函数会接收到两个参数：
   * absoluteRoute: 是否是绝对路由
   * route：路由
   * @param {function} handler 路由变化处理器
   */
  static subscribeRouteChange(handler) {
    if (!handler || typeof handler != "function") {
      return;
    }
    _handlers.push(handler);
  }
}
