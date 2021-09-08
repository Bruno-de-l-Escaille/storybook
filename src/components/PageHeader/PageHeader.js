import React, { Component } from "react";
import styles from "./PageHeader.module.scss";

class PageHeader extends Component {
  render() {
    const { header, subHeader, icon, buttons = [] } = this.props;

    return (
      <div className={`page-header`}>
        <div className="page-header__icon">{icon}</div>
        <div className="page-header__info">
          <div>
            <h3>{header}</h3>
            <p>{subHeader}</p>
          </div>
        </div>
        <div className="page-header__children">
          {buttons.map((button) => {
            return (
              <button
                className={`btn ${
                  styles[button.style]
                }`}
              >
                {button.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}
export default PageHeader;
