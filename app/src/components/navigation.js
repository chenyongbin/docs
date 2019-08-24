import React from "react";

export default class Navigation extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-dark bg-dark">
        <a className="navbar-brand" href="#js">
          JavaScript
        </a>
        <a className="navbar-brand" href="#csharp">
          CSharp
        </a>
        <a className="navbar-brand" href="#java">
          Java
        </a>
        <a className="navbar-brand" href="#python">
          Python
        </a>
      </nav>
    );
  }
}
