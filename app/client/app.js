import React, { Fragment, useState, useEffect } from "react";
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

let httpInstance = null;

/**
 * App组件
 */
export default function App() {
  const [appLoading, setAppLoading] = useState(true),
    [navigations, setNavigations] = useState(null),
    [subNavigations, setSubNavigations] = useState(null),
    [content, setContent] = useState(""),
    [contentLoading, setContentLoading] = useState(false);

  /**
   * 初始化
   */
  const initialize = () => {
    return Promise.resolve(
      (async () => {
        setAppLoading(true);

        let { Data: navigations } = await httpInstance.getSlim(
            Project.defaultRoute.navigations
          ),
          { Data: content } = await httpInstance.getSlim(
            Project.defaultRoute.readme
          );

        if (navigations && typeof navigations == "string") {
          navigations = JSON.parse(navigations);
        }

        setNavigations(navigations);
        setContent(content);
      })()
    ).finally(() => setAppLoading(false));
  };

  /**
   * 路由改变时的处理器
   * @param {boolean} absoluteRoute 是否是绝对路由
   * @param {string} route 路由地址
   */
  const onRouteChanged = (absoluteRoute, route) => {
    return Promise.resolve(
      (async () => {
        setContentLoading(true);
        setContent("");

        // 绝对路由时
        if (absoluteRoute) {
          let { Data: content } = await httpInstance.getSlim(route);
          setContent(content);
          return;
        }

        // 非绝对路由时
        let { Data: subNavigations } = await httpInstance.getSlim(
            `${route}/${Project.defaultRoute.navigations}`
          ),
          { Data: content } = await httpInstance.getSlim(
            `${route}/${Project.defaultRoute.readme}`
          );
        setSubNavigations(subNavigations);
        setContent(content);
      })()
    ).finally(() => {
      setContentLoading(false);
    });
  };

  useEffect(function() {
    // 初始化http实例
    httpInstance = new Http();
    // 开启路由服务
    Route.start();
    // 注册路由变化处理器
    Route.subscribeRouteChange(onRouteChanged);
    // 初始化
    initialize();

    return function() {
      // 停止路由服务
      Route.stop();
      // 销毁http实例
      httpInstance = null;
    };
  }, []);

  if (appLoading) {
    return <Loading message={Tips.loading.app} />;
  }

  return (
    <Fragment>
      <Navigation data={navigations} />
      <div className="row flex-grow-1 docs-container">
        <Sidebar data={subNavigations} />
        <Content loading={contentLoading} data={content} />
      </div>
      <RootSiblingContainer />
    </Fragment>
  );
}
