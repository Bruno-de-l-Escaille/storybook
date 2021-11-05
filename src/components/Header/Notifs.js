import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import moment from "moment";
import "moment/locale/fr";
import "moment/locale/nl";

import { getNotifications } from "../../api";
import { getApiUrl } from "../../utils";
import MenuItem from "./MenuItem";
import IconClose from "../Icons/IconClose";
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

export default function Notifs({ lng, auth, env, appName, navCommunity }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentNotif, setCurrentNotif] = useState(null);
  const isAdmin = auth && auth.user?.type === "ADMIN" ? true : false;
  const title = `title${lng.charAt(0).toUpperCase() + lng.slice(1)}`;
  const introduction = `intro${lng.charAt(0).toUpperCase() + lng.slice(1)}`;
  const content = `content${lng.charAt(0).toUpperCase() + lng.slice(1)}`;
  const [isFetching, setIsFetching] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const apiUrl = getApiUrl(env);

  useEffect(() => {
    if (!isFetching) {
      console.log("================", appName.toUpperCase());
      setIsFetching(true);
      getNotifications({
        apiUrl,
        token: auth.token,
        userId: auth.user.id,
        navCommunity,
        appName: appName.toUpperCase(),
        options: {
          limit: 6,
        },
      })
        .then((resp) => {
          setNotifications(resp.data.data);
        })
        .catch((e) => {
          // setIsFetching(false);
        });
    }
  });

  const renderNotifications = () => {
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
          className={notification.isRead ? styles.read : styles.notRead}
        >
          <a
            href={
              notification.contentType === "LINK" ? notification[content] : null
            }
            onClick={() => handleOnClick(notification)}
            target={notification.contentType === "LINK" ? "_blank" : "_self"}
          >
            <div>{notification[title]}</div>
            {notification.contentType === "TEXT" && notification[introduction] && (
              <div
                className={styles.notifContent}
                dangerouslySetInnerHTML={{
                  __html: notification[introduction],
                }}
              ></div>
            )}
            <div className={styles.infos}>{text}</div>
          </a>
          {!notification.isRead && (
            <span className={styles.notReadPoint}></span>
          )}
        </li>
      );
    });
  };

  const handleOnClick = (notification) => {
    if (notification?.contentType === "TEXT") {
      setCurrentNotif(notification);
      setIsOpen(true);
    }

    if (!notification.isRead) {
      if (window.handleViewNotification) {
        window.handleViewNotification(notification);
      }

      notification.isRead = true;
    }
  };

  const handleEditClick = () => {
    if (window.showNotifications) {
      window.showNotifications(appName);
    }
  };

  const unreadNotifs = notifications
    ? notifications.filter((notif) => notif.isRead === false)
    : [];

  return (
    <MenuItem
      icon="Notifs"
      className={styles.notif}
      count={unreadNotifs.length}
    >
      <div className={styles.socialLinksWrapper}>
        <div
          className={`${styles.socialLinksHeader} ${
            isAdmin ? styles.socialLinksHeader_admin : ""
          }`}
        >
          {I18N[lng]["notificationsOfUpdates"]}
          {isAdmin && (
            <span
              className={styles.socialLinksHeader_edit}
              onClick={() => handleEditClick()}
            >
              <i className="icon-sb-settings"></i>
            </span>
          )}
        </div>
        <div className={styles.socialLinksBody}>
          <ul className={styles.subMenuDropdown}>{renderNotifications()}</ul>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        className={{
          base: styles.modalContent,
          afterOpen: styles.modalContentAfterOpen,
          beforeClose: styles.modalContentBeforeClose,
        }}
        overlayClassName={{
          base: styles.modalOverlay,
          afterOpen: styles.modalOverlayAfterOpen,
          beforeClose: styles.modalOverlayBeforeClose,
        }}
        closeTimeoutMS={300}
        ariaHideApp={false}
      >
        <div className={`${styles.modal}`}>
          <div className={styles.modal_body}>
            <div className={styles.modal_header}>
              <h3>{currentNotif?.[title]}</h3>
              <div
                className={styles.modal_close}
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <IconClose width={14} />
              </div>
            </div>

            <div
              className={styles.modal_content}
              dangerouslySetInnerHTML={{
                __html: currentNotif?.[content],
              }}
            ></div>
          </div>
        </div>
      </Modal>
    </MenuItem>
  );
}
