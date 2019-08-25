import React from "react";
import ReactDOM from "react-dom";

import "./sass/index.scss";
import { Navigation, Sidebar, Content } from "./components";

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Navigation />
        <div className="container-fluid">
          <div className="row">
            <Sidebar className="col-3" />
            <Content />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
