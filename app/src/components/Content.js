import React from "react";
import { Layout } from "../variables";
import Loading from "./Loading";

export default class Content extends React.Component {
  render() {
    let { loading, data } = this.props;
    if (loading) {
      return <Loading />;
    }

    return (
      <div className={`${Layout.content} docs-content`}>
        <div>
          <pre>{data}</pre>
        </div>
      </div>
    );
  }
}
