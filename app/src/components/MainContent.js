import React from "react";
import { Http } from "../utils";
import { Layout } from "../variables";

export default class MainContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { html: "" };
    this.httpInstance = new Http();
  }

  componentDidMount() {
    this.httpInstance
      .getSlim("logs/dev1.md")
      .then(({ Data: html }) => this.setState({ html }));
  }

  componentWillUnmount() {
    if (this.httpInstance) {
      this.httpInstance.cancel();
      this.httpInstance = null;
    }
  }

  render() {
    return (
      <div className={`${Layout.mainContent} docs-main-content`}>
        <div className="mt-4 bg-light">
          <pre>{this.state.html}</pre>
        </div>
      </div>
    );
  }
}
