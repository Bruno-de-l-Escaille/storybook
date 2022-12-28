import React, { PureComponent } from "react";

import IconExternalLink from "../Icons/IconExternalLink";
import IconInsurance from "../Icons/IconInsurance";
import IconTrash from "../Icons/IconTrash"
import IconGlobe from "../Icons/IconGlobe";
import IconPen from "../Icons/IconPen";
import IconAdd from "../Icons/IconAdd";

import styles from "./CardTool.module.scss";
import classnames from "classnames";

export class CardTool extends PureComponent {
  render () {
    const {
      color,
      isFavorite,
      onAddFavorite,
      onDelete,
      onUpdate,
      onShare,
      data
    } = this.props;


    return (
      <div className={classnames(styles.card_frame, isFavorite ? styles.card_favorite : "")}>
        <div className={styles.card_content}>
          <div className={styles.card_header}>
            <IconInsurance />
            <div className={styles.card_info}>
              <div className={styles.card_info_title}>{data.title}</div>
              <div className={styles.card_info_link} style={{color: color}}><IconGlobe fill={color}/> {data.link}</div>
            </div>
          </div>
          <div className={styles.card_body}>
            {data.description}
          </div>
          <div className={styles.card_footer}>
            <div className={styles.card_footer_tag} style={{background: color}}>{data.tag}</div>
            <span style={{background: color}}/>
            <div className={styles.card_footer_group}>{data.organization}</div>
          </div>
        </div>
        <div className={styles.card_actions}>
          <div className={styles.card_action} onClick={() => onShare()}><IconExternalLink /></div>
          <div className={styles.card_action} onClick={() => onAddFavorite()}><IconAdd width={12} height={12}/></div>
          <div className={styles.card_action} onClick={() => onUpdate()}><IconPen /></div>
          <div className={classnames(styles.card_action, styles.card_action_danger)} onClick={() => onDelete()}><IconTrash height={16} width={14.23}/></div>
        </div>
      </div>
    );
  }
};
