import React from "react";
import classNames from "classnames";

import styles from "./Checkbox.module.scss";

const Checkbox = ({ checked, radio, onClick }) => {
  return (
    <div
      className={classNames(
        styles.checkbox,
        radio ? styles.radio : "",
        checked ? styles.checkbox_active : ""
      )}
      onClick={onClick}
    >
      {checked && (
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_49976_35660)">
            <path
              d="M3.95836 9.44352C3.68037 9.44352 3.41746 9.31425 3.24844 9.09253L0.965733 6.09609C0.668833 5.70637 0.746124 5.15145 1.1382 4.85621C1.53092 4.56085 2.08882 4.63818 2.38584 5.02764L3.88721 6.99818L7.66322 0.971768C7.9232 0.557165 8.47216 0.430308 8.89017 0.68834C9.30767 0.946626 9.43517 1.49266 9.17506 1.90764L4.71441 9.02637C4.55945 9.27386 4.29193 9.42955 3.99899 9.44275C3.98532 9.44326 3.97191 9.44352 3.95836 9.44352Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_49976_35660">
              <rect
                width="8.94276"
                height="8.88889"
                fill="white"
                transform="translate(0.576172 0.554688)"
              />
            </clipPath>
          </defs>
        </svg>
      )}
    </div>
  );
};

export default Checkbox;
