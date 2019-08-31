import React from "react";

/**
 * 加载中
 */
export default class Loading extends React.PureComponent {
  render() {
    return (
      <div className="flex-grow-1 row align-items-center docs-loading">
        <div className="col text-center">
          {(this.props.message || "加载中") + "..."}
        </div>
      </div>
    );
  }
}
