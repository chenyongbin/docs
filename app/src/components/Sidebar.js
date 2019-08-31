import React from "react";
import { Layout } from "../variables";

export default class Sidebar extends React.Component {
  render() {
    return <div className={`${Layout.sidebar} border-right docs-sidebar`}></div>;
  }
}
