import React from "react";
import MyAvatar from "../images/avatar.jpg";

export default class Navigation extends React.PureComponent {
  constructor(props) {
    super(props);

    this.getData = this.getData.bind(this);
    this.onClick = this.onClick.bind(this);
    this.renderNavItems = this.renderNavItems.bind(this);

    this.state = { data: null, path: "" };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    setTimeout(() => {
      this.setState({
        data: [
          { name: "JavaScript", path: "js" },
          { name: "Java", path: "java" },
          { name: "CSharp", path: "csharp" }
        ]
      });
    }, 100);
  }

  onClick(path) {
    this.setState({ path });
  }

  renderNavItems() {
    let { data } = this.state;

    if (!Array.isArray(this.state.data) || data.length == 0) {
      return null;
    }

    return (
      <ul className="navbar-nav flex-row">
        {data.map((item, index) => (
          <NavItem
            key={index}
            {...item}
            active={item.path == this.state.path}
            onClick={path => this.setState({ path })}
          />
        ))}
      </ul>
    );
  }

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark justify-content-start docs-navigation">
        <a className="navbar-brand" href="#" onClick={() => this.onClick("")}>
          <img className="avatar" src={MyAvatar} alt="我的头像" />
        </a>
        {this.renderNavItems()}
      </nav>
    );
  }
}

class NavItem extends React.PureComponent {
  render() {
    let { name, path, active, onClick } = this.props;

    return (
      <li className="nav-item ml-3" onClick={() => onClick && onClick(path)}>
        <a className={`nav-link ${active ? "active" : ""}`} href={`#${path}`}>
          {name}
        </a>
      </li>
    );
  }
}
