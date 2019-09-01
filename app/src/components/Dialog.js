import React from "react";
import { Project } from "../variables";

/**
 * 对话框
 */
export default class Dialog extends React.PureComponent {
  $modal = $(`#${Project.modalId}`);

  onOk = e => {
    this.$modal.modal("hide");
    this.props.onCancel && this.props.onOk();
  };

  onCancel = e => {
    this.$modal.modal("hide");
    this.props.onCancel && this.props.onCancel();
  };

  render() {
    if (!this.props.visible) {
      return null;
    }

    let okButton = null,
      cancelButton = null,
      {
        title = "温馨提示",
        message,
        okButtonText = "确定",
        cancelButtonText
      } = this.props;

    okButton = (
      <div
        className="flex-grow-1 p-3 text-center"
        data-dismiss="modal"
        onClick={this.onOk}
      >
        {okButtonText}
      </div>
    );

    if (cancelButtonText) {
      cancelButton = (
        <div
          className="flex-grow-1 p-3 text-center border-right border-light"
          data-dismiss="modal"
          onClick={this.onCancel}
        >
          {cancelButtonText}
        </div>
      );
    }

    return (
      <div
        id={Project.modalId}
        className="modal fade"
        tabIndex="-1"
        data-backdrop="static"
        role="dialog"
      >
        <div
          className="modal-dialog modal-sm modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header p-0 justify-content-center">
              <h5 className="mb-0 p-3 text-center">{title}</h5>
            </div>
            <div className="modal-body text-center">{message || ""}</div>
            <div className="modal-footer p-0 justify-content-center">
              {cancelButton}
              {okButton}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
