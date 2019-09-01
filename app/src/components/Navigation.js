import React from "react";

import ProjectReposity from "./ProjectReposity";
import MyAvatar from "../images/avatar.jpg";
import { Project } from "../variables";

/**
* 导航组件
* 数据示例：
* [
    {
      title: "读书笔记",
      route: "/notes",
      data: [
        { title: "JavaScript", route: "/notes/js" },
        { title: "C#", route: "/notes/csharp" },
        { title: "Python", route: "/notes/python" }
      ]
    },
    { title: "Java", route: "java" },
    { title: "算法", route: "algorithm" }
  ]
*/
export default class Navigation extends React.PureComponent {
  render() {
    let navs = null,
      { data } = this.props;

    if (data && data.length > 0) {
      navs = (
        <ul className="navbar-nav mr-auto">
          {data.map((item, index) => (
            <NavItem key={index} {...item} />
          ))}
        </ul>
      );
    }

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark docs-navigation">
        <a className="navbar-brand" href="#" onClick={removeAllActive}>
          <img className="avatar" src={MyAvatar} alt="我的头像" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {navs}
          <ul className="navbar-nav flex-row ml-auto docs-navigation-right">
            <ProjectReposity url={Project.reposity} />
          </ul>
        </div>
      </nav>
    );
  }
}

/**
 * 导航项
 */
class NavItem extends React.PureComponent {
  onClick = e => {
    removeAllActive();
    $(e.currentTarget).addClass("active");
  };

  render() {
    let { title, route, data } = this.props;

    // 有下拉选项时
    if (data && data.length > 0) {
      return (
        <li className="nav-item dropdown" onClick={e => this.onClick(e)}>
          <a
            className="nav-link dropdown-toggle"
            href={`#${route}`}
            role="button"
            data-toggle="dropdown"
          >
            {title}
          </a>
          <div className="dropdown-menu">
            {data.map((item, index) => (
              <a key={index} className="dropdown-item" href={`#${item.route}`}>
                {item.title}
              </a>
            ))}
          </div>
        </li>
      );
    }

    // 没有下拉选项时
    return (
      <li className="nav-item" onClick={e => this.onClick(e)}>
        <a className="nav-link" href={`#${route}`}>
          {title}
        </a>
      </li>
    );
  }
}

/**
 * 删除所有激活的导航
 */
const removeAllActive = () => {
  $(".docs-navigation .nav-item").removeClass("active");
};
