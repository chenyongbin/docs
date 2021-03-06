import React from "react";

const dispatches = [];

/**
 * 根组件容器
 */
export default class RootSiblingContainer extends React.Component {
  constructor(props) {
    super(props);
    dispatches.push(this._update);
    this._siblings = new Map();
  }

  _update = (id, element, callback) => {
    if (element) {
      this._siblings.set(id, element);
    } else {
      this._siblings.delete(id);
    }
    this.forceUpdate(callback);
  };

  render() {
    if (this._siblings.size == 0) {
      return null;
    }

    return (
      <React.Fragment>
        {[...this._siblings.values()].map((item, index) => (
          <React.Fragment key={index}>{item}</React.Fragment>
        ))}
      </React.Fragment>
    );
  }
}

/**
 * 根组件类
 */
export class RootSibling {
  constructor(element, callback) {
    this.id = `root-sibling-${parseInt(Math.random() * 100000000)}`;
    dispatches.forEach(dispatch => dispatch(this.id, element, callback));
  }

  update = (element, callback) => {
    dispatches.forEach(dispatch => dispatch(this.id, element, callback));
  };

  remove = callback => {
    dispatches.forEach(dispatch => dispatch(this.id, null, callback));
  };
}
