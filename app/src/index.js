import React from "react";
import ReactDOM from "react-dom";

import "./sass/index.scss";
import { Navigation, AsideNavigation, MainContent } from "./components";

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Navigation />
        <div className="row flex-grow-1 docs-container">
          <AsideNavigation />
          <MainContent />
        </div>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
