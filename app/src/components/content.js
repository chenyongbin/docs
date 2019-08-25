import React from "react";
import { Http } from "../utils";

export default class Content extends React.Component {
  constructor(props) {
    super(props);

    this.state = { doc: "" };
    this.httpInstance = new Http();
  }

  componentDidMount() {
    this.httpInstance
      .getSlim("logs/dev1.md")
      .then(({ Data: doc }) => this.setState({ doc }));
  }

  componentWillUnmount() {
    if (this.httpInstance) {
      this.httpInstance.cancel();
      this.httpInstance = null;
    }
  }

  render() {
    return (
      <div className="content col border">
        <div>
          <pre>{this.state.doc}</pre>
        </div>
      </div>
    );
  }
}
