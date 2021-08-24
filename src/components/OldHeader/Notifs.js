import React from "react";
import moment from "moment";
import MenuItem from "./MenuItem";

import styles from "./Header.module.scss";

const I18N = {
  en: {
    nothingToShow: "Nothing to show",
    notificationsOfUpdates: "Notifications of updates",
  },
  fr: {
    nothingToShow: "Aucunes notification n'est diponible",
    notificationsOfUpdates: "Notifications de mises à jour",
  },
  nl: {
    nothingToShow: "Niets om te laten zien'",
    notificationsOfUpdates: "Meldingen van updates",
  },
};

export default function Notifs({ notifications, lng, onClick }) {
  const renderNotifications = () => {
    const subject = `subject${lng.charAt(0).toUpperCase() + lng.slice(1)}`;
    if (notifications.length === 0) {
      return <li className="p-b-m">{I18N[lng]["nothingToShow"]}</li>;
    }

    moment.locale(lng);
    return notifications.map((notification) => {
      const createdAtDate = moment(notification.createdAt);
      const text =
        moment().diff(createdAtDate, "month", true) > 1
          ? createdAtDate.format("DD MMM YYYY")
          : createdAtDate.fromNow();

      return (
        <li
          key={notification.id}
          className={notification.status === "UNREAD" ? styles.notRead : ""}
        >
          <a
            href={notification.url || null}
            onClick={() => onClick(notification.id)}
          >
            <span>{notification[subject]}</span>
            <div className={styles.infos}>{text}</div>
          </a>
        </li>
      );
    });
  };

  const unreadNotifs = notifications.filter(
    (notif) => notif.status === "UNREAD"
  );

  return (
    <MenuItem
      icon="Notifs"
      className={styles.notif}
      count={unreadNotifs.length}
    >
      <div className={styles.socialLinksWrapper}>
        <div className={styles.socialLinksHeader}>
          {I18N[lng]["notificationsOfUpdates"]}
        </div>
        <div className={styles.socialLinksBody}>
          <ul className={styles.subMenuDropdown}>{renderNotifications()}</ul>
        </div>
      </div>
    </MenuItem>
  );
}
