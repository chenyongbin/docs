import React from "react";
import { Project } from "../variables";

/**
 * 对话框
 */
export default function Dialog({
  visible,
  title = "温馨提示",
  message,
  okButtonText = "确定",
  cancelButtonText,
  onOk,
  onCancel
} = {}) {
  if (!visible) {
    return null;
  }

  const $modal = $(`#${Project.modalId}`),
    onOkHandler = e => {
      $modal.modal("hide");
      onOk && onOk();
    },
    onCancelHandler = e => {
      $modal.modal("hide");
      onCancel && onCancel();
    };

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
            {!cancelButtonText ? null : (
              <div
                className="flex-grow-1 p-3 text-center border-right border-light"
                data-dismiss="modal"
                onClick={onCancelHandler}
              >
                {cancelButtonText}
              </div>
            )}
            <div
              className="flex-grow-1 p-3 text-center"
              data-dismiss="modal"
              onClick={onOkHandler}
            >
              {okButtonText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
