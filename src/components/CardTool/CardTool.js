import React, { Fragment, PureComponent } from "react";
import classnames from "classnames";
import { I18N } from "../../i18n";

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
      displayTooltip: false,
      selectedValue: props.scope,
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
      this.setState({ displayTooltip: false, selectedValue: null });
    }
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleShareCardtool = () => {
    let { selectedValue } = this.state;
    this.props.onShare(selectedValue);
    this.setState({ displayTooltip: false, selectedValue: null });
  };

  renderScoopIcon = (type) => {
    switch (type) {
      case "public":
        return <IconUnlock />;
      case "private":
        return <IconLock />;
      case "shared":
        return <IconShare width={12} height={12} fill="#6D7F92" />;
      default:
        return null;
    }
  };

  render() {
    const {
      lng,
      data,
      color,
      loadingActions,
      allowedActions,
      isFavorite,
      transparent,
      toolOptions,
      onAddFavorite,
      onUnshare,
      onDelete,
      onUpdate,
      onReach,
    } = this.props;
    let { moreActions, displayTooltip, selectedValue } = this.state;
    let language = lng ? lng : "fr";
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
              <div className={styles.card_footer_tags_scoop}>
                {this.renderScoopIcon(data.scoop)}
                {data.scoop}
              </div>
              <div
                className={styles.card_footer_tags_tag}
                style={{ background: `${color}20`, color }}
              >
                {data.tag}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.card_actions}>
          <div className={styles.card_action} onClick={() => onReach()}>
            {<IconExternalLink />}
          </div>
          {allowedActions && allowedActions.favorite ? (
            <div
              className={classnames(
                styles.card_action,
                isFavorite ? styles.card_action_activated : ""
              )}
              onClick={() => onAddFavorite()}
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
          {allowedActions && allowedActions.unshare ? (
            <div
              className={classnames(
                styles.card_action,
                displayTooltip ? styles.card_action_activated : ""
              )}
              onClick={() => onUnshare()}
            >
              {loadingActions && loadingActions.unShare ? (
                <IconCircleLoader />
              ) : (
                <IconUnShare
                  fill="#18A0FB"
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                />
              )}
            </div>
          ) : (
            <div
              className={classnames(
                styles.card_action,
                displayTooltip ? styles.card_action_activated : ""
              )}
              onClick={() => this.setState({ displayTooltip: true })}
            >
              {loadingActions && loadingActions.share ? (
                <IconCircleLoader />
              ) : (
                <IconShare fill={displayTooltip ? "#FFFFFF" : "#18A0FB"} />
              )}
            </div>
          )}
          {allowedActions && allowedActions.more ? (
            moreActions ? (
              <Fragment>
                <div className={styles.card_action} onClick={() => onUpdate()}>
                  <IconPen />
                </div>
                <div
                  className={classnames(
                    styles.card_action,
                    styles.card_action_danger
                  )}
                  onClick={() => onDelete()}
                >
                  <IconTrash height={16} width={14.23} />
                </div>
              </Fragment>
            ) : (
              <div
                className={styles.card_action}
                onClick={() => this.setState({ moreActions: true })}
              >
                <IconMore />
              </div>
            )
          ) : (
            ""
          )}
        </div>
        {displayTooltip && (
          <div
            className={styles.card_tooltip}
            ref={this.setWrapperRef.bind(this)}
          >
            <span>{I18N[language].sharedWith} :</span>
            <div className={styles.card_tooltip_options}>
              {toolOptions && toolOptions.length ? (
                toolOptions.map((item, i) => {
                  return (
                    <div>
                      <input
                        type="radio"
                        id={item.value}
                        name="scoop"
                        value={item.value}
                        checked={item.value === selectedValue}
                        onClick={() =>
                          this.setState({ selectedValue: item.value })
                        }
                      />
                      <label for={item.id}>{item.label}</label>
                    </div>
                  );
                })
              ) : (
                <div className={styles.no_options}>
                  {I18N[language].noOptions}
                </div>
              )}
            </div>
            <button
              disabled={!selectedValue}
              onClick={this.handleShareCardtool}
              style={{ opacity: selectedValue ? 1 : 0.5 }}
            >
              {I18N[language].share}
            </button>
          </div>
        )}
      </div>
    );
  }
}
