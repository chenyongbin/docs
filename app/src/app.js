import React from "react";
import {
  Navigation,
  Sidebar,
  Content,
  Loading,
  RootSiblingContainer
} from "./components";
import { Http, Route } from "./utils";
import { Tips, Project } from "./variables";
import "./sass/index.scss";

/**
 * App组件
 */
export default class App extends React.Component {
  state = {
    appLoading: true,
    navigations: null,
    subNavigations: null,
    content: "",
    contentLoading: false
  };
  httpInstance = new Http();

  componentDidMount() {
    // 开启路由服务
    Route.start();
    // 注册路由变化处理器
    Route.subscribeRouteChange(this.onRouteChanged);
    // 初始化
    this.initialize();
  }

  componentWillUnmount() {
    // 停止路由服务
    Route.stop();
  }

  /**
   * 初始化
   */
  initialize = () => {
    return Promise.resolve(
      (async () => {
        this.setState({ appLoading: true });

        let { Data: navigations } = await this.httpInstance.getSlim(
            Project.defaultRoute.navigations
          ),
          { Data: content } = await this.httpInstance.getSlim(
            Project.defaultRoute.readme
          );

        if (navigations && typeof navigations == "string") {
          navigations = JSON.parse(navigations);
        }

        this.setState({ appLoading: false, navigations, content });
      })()
    ).catch(() => this.setState({ appLoading: false }));
  };

  /**
   * 路由改变时的处理器
   * @param {boolean} absoluteRoute 是否是绝对路由
   * @param {string} route 路由地址
   */
  onRouteChanged = (absoluteRoute, route) => {
    return Promise.resolve(
      (async () => {
        this.setState({
          contentLoading: true,
          subNavigations: null,
          content: null
        });

        // 绝对路由时
        if (absoluteRoute) {
          let { Data: content } = await this.httpInstance.getSlim(route);
          this.setState({ contentLoading: false, content });
          return;
        }

        // 非绝对路由时
        let { Data: subNavigations } = await this.httpInstance.getSlim(
            `${route}/${Project.defaultRoute.navigations}`
          ),
          { Data: content } = await this.httpInstance.getSlim(
            `${route}/${Project.defaultRoute.readme}`
          );
        this.setState({ contentLoading: false, subNavigations, content });
      })()
    ).catch(() => this.setState({ contentLoading: false }));
  };

  render() {
    let {
      navigations,
      appLoading,
      subNavigations,
      content,
      contentLoading
    } = this.state;

    if (appLoading) {
      return <Loading message={Tips.loading.app} />;
    }

    return (
      <React.Fragment>
        <Navigation data={navigations} />
        <div className="row flex-grow-1 docs-container">
          <Sidebar data={subNavigations} />
          <Content loading={contentLoading} data={content} />
        </div>
        <RootSiblingContainer />
      </React.Fragment>
    );
  }
}
