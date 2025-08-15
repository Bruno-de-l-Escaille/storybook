/* eslint-disable no-unused-expressions */
import React, { PureComponent } from "react";

class TTPGalleryWidget extends PureComponent {
  constructor(props) {
    super(props);
    this.widgetGalleryRef = React.createRef();
  }

  componentDidMount() {
    if (window.TTPGalleryWidget !== undefined) {
      window.TTPGalleryWidget.mount(this.props, this.widgetGalleryRef.current);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (window.TTPGalleryWidget !== undefined) {
        window.TTPGalleryWidget.mount(
          this.props,
          this.widgetGalleryRef.current
        );
      }
    }
  }

  componentWillUnmount() {
    window.TTPGalleryWidget?.unmount(this.widgetGalleryRef.current);
  }

  render() {
    return <div ref={this.widgetGalleryRef}></div>;
  }
}

export default TTPGalleryWidget;
