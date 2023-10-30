import React, { Component } from "react";
import debounce from "lodash.debounce";

import styles from "./SearchBox.module.scss";

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: props.value || "" };
    this.handleSearchInputChange = debounce(this.handleSearchInputChange, 1000);
  }

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      this.props.onChange(event.target.value);
    }
  };

  debounceSearchHandler = (event) => {
    this.setState({ inputValue: event.target.value });
    this.handleSearchInputChange(event.target.value);
  };

  handleSearchInputChange = (value) => {
    this.props.onChange(value);
  };

  clearAll = () => {
    this.setState({ inputValue: "" });
    this.handleSearchInputChange("");
  };

  render() {
    const { placeholder } = this.props;
    const { inputValue } = this.state;

    return (
      <div className={styles.searchBox}>
        <span className={styles.searchBox__icon}>
          <i className="icon-sb-magnifier"></i>
        </span>
        <input
          value={inputValue}
          placeholder={placeholder || "search"}
          onChange={this.debounceSearchHandler}
          onKeyPress={this.handleKeyPress}
        />
        {inputValue && inputValue.length && (
          <i className="icon-sb-close" onClick={this.clearAll} />
        )}
      </div>
    );
  }
}

export default SearchBox;
