import React, { Fragment, PureComponent } from "react";
import classnames from "classnames";

import IconExternalLink from "../Icons/IconExternalLink";
import IconTrash from "../Icons/IconTrash";
import IconGlobe from "../Icons/IconGlobe";
import IconUnlock from "../Icons/IconUnlock";
import IconLock from "../Icons/IconLock";
import IconPen from "../Icons/IconPen";
import IconMore from "../Icons/IconMore";
import IconShare from "../Icons/IconShare";
import IconUnShare from "../Icons/IconUnshare";
import IconStarEmpty from "../Icons/IconStarEmpty";
import IconStarFull from "../Icons/IconStarFull";
import IconCircleLoader from "../Icons/IconCircleLoader";

import styles from "./CardTool.module.scss";

export class CardTool extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      moreActions: false,
    };
  }
  componentDidMount() {
    document.addEventListener(
      "mousedown",
      this.handleClickOutsideTooltip.bind(this)
    );
  }

  handleClickOutsideTooltip(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.setTooltipVisibility(null);
    }
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  renderScopeIcon = (type) => {
    switch (type) {
      case ("public", "publique"):
        return <IconUnlock />;
      case "private":
        return <IconLock />;
      default:
        return <IconShare width={12} height={12} fill="#6D7F92" />;
    }
  };

  render() {
    const {
      data,
      color,
      displayTooltip,
      loadingActions,
      allowedActions,
      isFavorite,
      transparent,
      toolContent,
      onAddFavorite,
      onUnshare,
      onDelete,
      onUpdate,
    } = this.props;
    return (
      <div
        className={classnames(
          styles.card_frame,
          transparent
            ? styles.card_frame_transparent
            : displayTooltip
            ? styles.card_frame_show_actions
            : ""
        )}
        onClick={() => window.open(data.link, "_blank")}
      >
        <div className={styles.card_content}>
          <div className={styles.card_header}>
            <i className={`icon webtool-${data.icon}`} />
            <div className={styles.card_info}>
              <div className={styles.card_info_title}>{data.title}</div>
              <div className={styles.card_info_link} style={{ color: color }}>
                <IconGlobe fill={color} /> <span>{data.link}</span>
              </div>
            </div>
          </div>
          <div className={styles.card_body}>{data.description}</div>
          <div className={styles.card_footer}>
            <span>{data.created}</span>
            <span>{data.organization}</span>
            <div className={styles.card_footer_tags}>
              <div
                className={styles.card_footer_tags_tag}
                style={{ background: `${color}30`, color }}
              >
                {data.tag}
              </div>
              {data.source && (
                <div
                  className={styles.card_footer_tags_tag}
                  style={{ background: "#8FBC8B", color: "#fff" }}
                >
                  {data.source}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.card_actions}>
          {allowedActions && allowedActions.share ? (
            <div
              className={classnames(
                styles.card_action,
                displayTooltip ? styles.card_action_activated : ""
              )}
              onClick={() => {
                if (!loadingActions || !loadingActions.share) {
                  this.props.setTooltipVisibility(data.id);
                } else return;
              }}
            >
              {loadingActions && loadingActions.share ? (
                <IconCircleLoader />
              ) : (
                <IconShare fill={displayTooltip ? "#FFFFFF" : "#18A0FB"} />
              )}
            </div>
          ) : (
            ""
          )}
          {allowedActions && allowedActions.unshare ? (
            <div
              className={classnames(
                styles.card_action,
                styles.card_action_danger
              )}
              onClick={(e) => {
                e.stopPropagation();
                onUnshare();
              }}
            >
              {loadingActions && loadingActions.unShare ? (
                <IconCircleLoader />
              ) : (
                <IconUnShare width={16} height={16} viewBox="0 0 16 16" />
              )}
            </div>
          ) : (
            ""
          )}
          {allowedActions && allowedActions.favorite ? (
            <div
              className={classnames(
                styles.card_action,
                isFavorite ? styles.card_action_activated : ""
              )}
              onClick={(e) => {
                e.stopPropagation();
                onAddFavorite();
              }}
            >
              {loadingActions && loadingActions.favorite ? (
                <IconCircleLoader />
              ) : isFavorite ? (
                <IconStarFull />
              ) : (
                <IconStarEmpty />
              )}
            </div>
          ) : (
            ""
          )}

          <Fragment>
            {allowedActions?.update && (
              <div
                className={styles.card_action}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate();
                }}
              >
                <IconPen />
              </div>
            )}
            {allowedActions?.delete && (
              <div
                className={classnames(
                  styles.card_action,
                  styles.card_action_danger
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <IconTrash height={16} width={14.23} />
              </div>
            )}
          </Fragment>
        </div>
        {displayTooltip && (
          <div
            className={styles.card_tooltip}
            ref={this.setWrapperRef.bind(this)}
          >
            {toolContent}
          </div>
        )}
      </div>
    );
  }
}
