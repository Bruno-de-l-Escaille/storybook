/* eslint-disable no-unused-expressions */
import React, { PureComponent } from "react";

class TTPFaqWidget extends PureComponent {
  constructor(props) {
    super(props);
    this.widgetFaqRef = React.createRef();
  }

  componentDidMount() {
    if (window.TTPFAQWidget !== undefined) {
      window.TTPFAQWidget.mount(this.props, this.widgetFaqRef.current);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (window.TTPFAQWidget !== undefined) {
        window.TTPFAQWidget.mount(this.props, this.widgetFaqRef.current);
      }
    }
  }

  componentWillUnmount() {
    window.TTPFAQWidget?.unmount(this.widgetFaqRef.current);
  }

  render() {
    return <div ref={this.widgetFaqRef}></div>;
  }
}

export default TTPFaqWidget;
