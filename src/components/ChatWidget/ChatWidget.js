import React, { Component, useEffect, useState } from "react";

const STYLES = {
  position: "fixed",
  bottom: 0,
  right: "86px",
  zIndex: 99999999,
};

class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.widgetRef = React.createRef();
  }

  componentDidMount() {
    if (window.ChatWidget !== undefined) {
      window.ChatWidget.mount(this.props, this.widgetRef.current);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps !== this.props) {
      if (window.ChatWidget !== undefined) {
        window.ChatWidget.mount(
          { ...prevProps, ...this.props },
          this.widgetRef.current
        );
      }
    }
  }

  componentWillUnmount() {
    if (window.ChatWidget !== undefined) {
      window.ChatWidget.unmount(this.widgetRef.current);
    }
  }

  render() {
    return (
      <div
        id={"chat-widget"}
        style={{ ...STYLES, ...this.props.style }}
        ref={this.widgetRef}
      />
    );
  }
}

const ChatWidget = (props) => {
  const { env, onLoad, style } = props;
  const [widgetProps, setWidgetProps] = useState();
  useEffect(() => {
    const jsScript = document.createElement("script");
    jsScript.src = `https://tamtam.s3.eu-west-1.amazonaws.com/cdn/chat-widget/${env}/widget.js`;
    document.body.appendChild(jsScript);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = `https://tamtam.s3.eu-west-1.amazonaws.com/cdn/chat-widget/${env}/widget.css`;
    document.head.appendChild(link);

    jsScript.addEventListener("load", () => {
      onLoad();
    });

    const onMessage = (msg) => {
      if (
        typeof msg.data === "object" &&
        msg.data.type === "SHOW_CHAT_WIDGET" &&
        msg.data.props
      ) {
        setWidgetProps(msg.data.props);
      }
    };
    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);
  return (
    <>
      {widgetProps ? (
        <ChatContainer env={env} style={style} {...widgetProps} />
      ) : null}
    </>
  );
};

export default React.memo(ChatWidget);
