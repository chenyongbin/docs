import React from "react";

/**
 * 加载中
 */
export default function Loading({ message = "加载中" }) {
  return (
    <div className="flex-grow-1 row align-items-center docs-loading">
      <div className="col text-center">{message + "..."}</div>
    </div>
  );
}
