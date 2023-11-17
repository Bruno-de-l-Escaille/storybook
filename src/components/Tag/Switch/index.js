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

  componentWillReceiveProps(nextProps) {
    if (this.state.isChecked !== nextProps.isChecked) {
      this.setState({ isChecked: !this.state.isChecked });
    }
  }

  // static getDerivedStateFromProps(props, state) {
  //   console.log(state.isChecked !== props.isChecked);
  //   if (state.isChecked !== props.isChecked) {
  //     return {
  //       isChecked: !state.isChecked,
  //     };
  //   }
  //   return null;
  // }

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
            <span>
              <span className="icon icon-toolbar grid-view" />
            </span>
            <span>
              <span className="icon icon-toolbar ticket-view" />
            </span>
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
