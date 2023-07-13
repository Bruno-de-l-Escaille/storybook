import React, { PureComponent } from "react";

const SVG_UP_ICON = (
  <svg
    className=""
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        d="M5.57169 2.87196L0.177143 8.26831C-0.0590474 8.5051 -0.0590474 8.88873 0.177143 9.12612C0.413333 9.36291 0.796967 9.36291 1.03316 9.12612L5.99968 4.15781L10.9662 9.12552C11.2024 9.36231 11.586 9.36231 11.8228 9.12552C12.059 8.88874 12.059 8.5045 11.8228 8.26771L6.42826 2.87137C6.19451 2.63817 5.80484 2.63817 5.57169 2.87196Z"
        fill="#18A0FB"
      ></path>
    </g>
  </svg>
);

class StyledTabs extends PureComponent {
  state = {
    prevVisible: false,
    nextVisible: true,
  };

  updateControlsVisibility = (number = 0) => {
    const tabRef = this.refs.tabItems;
    if (tabRef) {
      const newLeftPosition = tabRef.scrollLeft + number;
      let maxScrollLeft = tabRef.scrollWidth - tabRef.clientWidth;

      this.setState({
        nextVisible: maxScrollLeft > newLeftPosition,
        prevVisible: newLeftPosition > 0,
      });
    }
  };

  swipItems = (number) => {
    const tabRef = this.refs.tabItems;
    if (tabRef) {
      const newLeftPosition = tabRef.scrollLeft + number;

      this.updateControlsVisibility(number);

      tabRef.scrollLeft = newLeftPosition;
    }
  };

  componentDidMount() {
    this.updateControlsVisibility();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tabs != this.props.tabs) {
      this.updateControlsVisibility();
    }
  }

  render() {
    const { children, active, tabs, setActiveTab, light } = this.props;
    const { prevVisible, nextVisible } = this.state;

    let ctrlCount = 0;
    if (prevVisible) {
      ctrlCount = 1;
    }
    if (nextVisible) {
      ctrlCount++;
    }

    return (
      <div className={`styled-tabs ${light ? "light" : ""}`}>
        <div className="styled-tabs__header">
          {prevVisible && (
            <span
              className="control previous"
              onClick={() => this.swipItems(-STEP)}
            >
              {SVG_UP_ICON}
            </span>
          )}
          <div
            ref="tabItems"
            className={`styled-tabs__header-items ${
              ctrlCount && "control-" + ctrlCount
            }`}
          >
            {tabs.map(({ key, title }) => (
              <a
                key={key}
                onClick={() => setActiveTab(key)}
                className={`tab ${key === active ? "active" : ""}`}
              >
                {title}
              </a>
            ))}
          </div>
          {nextVisible && (
            <span className="control next" onClick={() => this.swipItems(STEP)}>
              {SVG_UP_ICON}
            </span>
          )}
        </div>
        {children && tabs && tabs.length > 0 && (
          <div className="styled-tabs__content">{children}</div>
        )}
      </div>
    );
  }
}

export default StyledTabs;

const STEP = 80;
