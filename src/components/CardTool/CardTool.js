import React, { Fragment, PureComponent } from "react";

import IconExternalLink from "../Icons/IconExternalLink";
import IconInsurance from "../Icons/IconInsurance";
import IconTrash from "../Icons/IconTrash";
import IconGlobe from "../Icons/IconGlobe";
import IconUnlock from "../Icons/IconUnlock";
import IconPen from "../Icons/IconPen";
import IconMore from "../Icons/IconMore";
import IconShare from "../Icons/IconShare";
import IconStarEmpty from "../Icons/IconStarEmpty";
import IconStarFull from "../Icons/IconStarFull";

import styles from "./CardTool.module.scss";
import classnames from "classnames";

export class CardTool extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      moreActions: false,
    };
  }
  render() {
    const {
      color,
      isFavorite,
      onAddFavorite,
      onDelete,
      onUpdate,
      onShare,
      onReach,
      data,
    } = this.props;
    let { moreActions } = this.state;

    return (
      <div className={styles.card_frame}>
        <div className={styles.card_content}>
          <div className={styles.card_header}>
            <i className={`icon icon-${data.icon}`} />
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
                <IconUnlock />
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
          <div
            className={classnames(
              styles.card_action,
              isFavorite && styles.card_action_activated
            )}
            onClick={() => onAddFavorite()}
          >
            {isFavorite ? <IconStarFull /> : <IconStarEmpty />}
          </div>
          <div className={styles.card_action} onClick={() => onShare()}>
            <IconShare fill="#18A0FB" />
          </div>
          {moreActions ? (
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
          )}
        </div>
      </div>
    );
  }
}
