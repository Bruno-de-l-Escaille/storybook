import React, { Component } from "react";

import styles from "./Switch.module.scss";

export default class Switch extends Component {
  constructor(props) {
    super(props);
    this.switchRef = React.createRef();
    this.state = {
      isChecked: props.isChecked,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.isChecked !== nextProps.isChecked) {
      this.setState({ isChecked: !this.state.isChecked });
    }
  }

  render() {
    let { name } = this.props;

    return (
      <div className="switch-container">
        <label>
          <input
            ref={this.switchRef}
            name={name}
            checked={this.state.isChecked}
            onChange={this._handleChange.bind(this)}
            className={styles["ttp-switch"]}
            type="checkbox"
          />
          <div>
            <div />
          </div>
        </label>
      </div>
    );
  }

  _handleChange() {
    this.setState({ isChecked: !this.state.isChecked }, function () {
      this.props.onChange(this.state.isChecked);
    });
  }
}
