import React from "react";
import { Dialog } from "../components";
import { RootSibling } from "../components/RootSiblingContainer";
import { Project } from "../variables";

let sibling = null;

/**
 * 通过js代码手动显示modal
 */
const showModal = () => {
  $(`#${Project.modalId}`).modal();
};

/**
 * 打开对话框
 */
export default (message, options) => {
  let props = Object.assign({}, options, { visible: true, message });

  props.onOk = () => {
    props.visible = false;
    options.onOk && options.onOk();
  };

  if (props.cancelButtonText) {
    props.onCancel = () => {
      props.visible = false;
      options.onCancel && options.onCancel();
    };
  }

  if (sibling) {
    sibling.update(<Dialog {...props} />, showModal);
  } else {
    sibling = new RootSibling(<Dialog {...props} />, showModal);
  }
};
