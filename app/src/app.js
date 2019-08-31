import React from "react";
import { Navigation, Sidebar, Content, Loading } from "./components";
import { Route } from "./utils";
import { Tips } from "./variables";
import "./sass/index.scss";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.state = { data: null, loading: true };
  }

  componentDidMount() {
    // 开启路由服务
    Route.start();
    this.getData();
  }

  componentWillUnmount() {
    // 停止路由服务
    Route.stop();
  }

  getData() {
    setTimeout(() => {
      this.setState({ loading: false });
    }, 1000);
  }

  render() {
    let { loading, data } = this.state;

    if (loading) {
      return <Loading message={Tips.loading.app} />;
    }

    return (
      <React.Fragment>
        <Navigation />
        <div className="row flex-grow-1 docs-container">
          <Sidebar />
          <Content />
        </div>
      </React.Fragment>
    );
  }
}
