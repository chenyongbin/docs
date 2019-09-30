import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import "./sass/index.scss";

ReactDOM.render(<App />, document.getElementById("root"));

/**
 * 文档加载完毕后
 */
$(function() {
    $('#root').addClass('min-vh-100 container-fluid m-0 p-0 d-flex flex-column');
});
