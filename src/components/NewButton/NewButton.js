import React, { Component } from "react";
import styles from "./NewButton.module.scss";
import classnames from "classnames";
import IconLoader from "../Icons/IconLoader";

class NewButton extends Component {
  render() {
    const { inProcess, variant = "primary", children, disabled } = this.props;

    return (
      <button
        className={classnames(
          styles.button,
          styles[variant],
          disabled && styles.disabled
        )}
        onClick={() => this.props.onClick()}
      >
        {inProcess ? (
          <IconLoader />
        ) : (
          <div>
            {children}{" "}
            {variant == "showmore" && (
              <i
                className={classnames(
                  "icon-sb-arrow-down",
                  styles.showmoreicon
                )}
              >
                {" "}
              </i>
            )}{" "}
          </div>
        )}
      </button>
    );
  }
}

export default NewButton;
