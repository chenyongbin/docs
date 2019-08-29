let _listening = false;

/**
 * 路由类
 */
export default class Route {
  static start() {
    if (_listening) {
      return;
    }

    window.onhashchange = ({ newURL, oldURL }) =>
      console.log(`newURL=${newURL}\noldURL=${oldURL}`);
  }

  static stop() {}
}
