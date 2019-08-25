import React from "react";

const subjects = [
  {
    title: "subject 1",
    items: [
      { title: "subject 1-1", path: "/logs/dev1.md" },
      { title: "subject 1-2", path: "/logs/dev1.md" },
      { title: "subject 1-3", path: "/logs/dev1.md" }
    ]
  },
  {
    title: "subject 2",
    items: [
      { title: "subject 2-1", path: "/logs/dev1.md" },
      { title: "subject 2-2", path: "/logs/dev1.md" },
      { title: "subject 2-3", path: "/logs/dev1.md" }
    ]
  },
  {
    title: "subject 3",
    items: [
      { title: "subject 3-1", path: "/logs/dev1.md" },
      { title: "subject 3-2", path: "/logs/dev1.md" },
      { title: "subject 3-3", path: "/logs/dev1.md" }
    ]
  },
  {
    title: "subject 4",
    path: "/logs/dev1.md"
  }
];

export default class Sidebar extends React.Component {
  render() {
    return (
      <div className={this.props.className + " sidebar"}>
        {subjects.map((item, index) => (
          <Subject key={index} {...item} />
        ))}
      </div>
    );
  }
}

class Subject extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.renderItems = this.renderItems.bind(this);

    this.state = { expanded: true };
  }

  toggle() {
    if (this.props.path) {
      location.hash = this.props.path;
      return;
    }

    this.setState(prevState => {
      prevState.expanded = !prevState.expanded;
      return prevState;
    });
  }

  renderItems() {
    if (!this.state.expanded || !Array.isArray(this.props.items)) {
      return null;
    }

    return (
      <div className="items">
        {this.props.items.map((item, index) => (
          <SubSubject key={index} {...item} />
        ))}
      </div>
    );
  }

  render() {
    return (
      <div className="subject" onClick={this.toggle}>
        <p className="title">{this.props.title}</p>
        {this.renderItems()}
      </div>
    );
  }
}

class SubSubject extends React.PureComponent {
  render() {
    return (
      <a className="item" href={this.props.path}>
        {this.props.title}
      </a>
    );
  }
}
