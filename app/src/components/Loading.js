import React from "react";

/**
 * 加载中
 */
export default class Loading extends React.PureComponent {
  render() {
    return (
      <div className="w-100 h-100 d-flex docs-loading">
        <div>{this.props.message || "加载中"}</div>
      </div>
    );
  }
}
