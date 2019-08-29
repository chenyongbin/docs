import React from "react";
import ReactDOM from "react-dom";

import "./sass/index.scss";
import { Navigation, Sidebar, Content } from "./components";
import { Route } from "./utils";

class App extends React.Component {
  componentDidMount() {
    Route.start();
  }

  componentWillUnmount() {
    Route.stop();
  }

  render() {
    return (
      <React.Fragment>
        <Navigation />
        <div className="row flex-grow-1 mt-2 docs-container">
          <Sidebar />
          <Content />
        </div>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
