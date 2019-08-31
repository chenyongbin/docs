import React from "react";
import { Http } from "../utils";
import { Layout } from "../variables";
import Loading from "./Loading";

export default class Content extends React.Component {
  httpInstance = new Http();
  state = { html: "", loading: true };

  componentDidMount() {
    this.httpInstance
      .getSlim("logs/dev1.md")
      .then(({ Data: html }) => this.setState({ html, loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  componentWillUnmount() {
    if (this.httpInstance) {
      this.httpInstance.cancel();
      this.httpInstance = null;
    }
  }

  render() {
    let { loading, html } = this.state;
    if (loading) {
      return <Loading />;
    }

    return (
      <div className={`${Layout.content} docs-content`}>
        <div className="bg-light">
          <pre>{html}</pre>
        </div>
      </div>
    );
  }
}
