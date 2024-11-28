import React, { Component } from "react";
import PropTypes from "prop-types";

import { getUserNameForAvatar } from "../../../lib/utils";

export class Avatar extends Component {
  render() {
    const {
      avatarUrl,
      showInfo,
      firstName,
      lastName,
      avatarSignature,
      noMargin,
      isLarge,
    } = this.props;

    let avatarName = "";
    if (firstName) {
      avatarName += firstName;
    }
    if (lastName) {
      avatarName += " " + lastName;
    }
    return (
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <img className="w-8 h-8 rounded-full" src={avatarUrl} alt="" />
        ) : (
          <div className="relative inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
            <span className="font-medium text-gray-600 dark:text-gray-300">
              {getUserNameForAvatar(firstName, lastName)}
            </span>
          </div>
        )}
        {showInfo && (
          <div className="font-medium text-gray-500">
            <div>{avatarName}</div>
            {avatarSignature && (
              <div className="text-sm text-gray-400">{avatarSignature}</div>
            )}
          </div>
        )}
      </div>
    );
  }
}

Avatar.propTypes = {
  avatarUrl: PropTypes.string,
  showInfo: PropTypes.bool,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  avatarSignature: PropTypes.string,
};
Avatar.defaultProps = {
  avatarUrl: null,
  showInfo: true,
};
