import React, { useState, useCallback, useMemo } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import styles from "./GuestActionModal.module.scss";
import IconUserRoundCheck from "../../../Icons/IconUserRoundCheck";
import IconUserRoundX from "../../../Icons/IconUserRoundX";
import IconSend from "../../../Icons/IconSendV2";
import AlertCircle from "../../../Icons/AlertCircle";
import ClipLoader from "react-spinners/ClipLoader";
import { I18N } from "../../../../i18n";
import { getSendingUrl } from "../../../../utils";

const MODAL_TYPES = {
  ACCEPT: "accept",
  DECLINE: "decline",
  SEND: "send",
};

export const GuestActionModal = ({
  isOpen,
  onClose,
  onConfirm,
  type = MODAL_TYPES.ACCEPT,
  guestStats = {},
  language,
  env,
}) => {
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [sendImmediately, setSendImmediately] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendingUrl = getSendingUrl(env);

  const handleStatusToggle = useCallback((status) => {
    setSelectedStatuses((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status);
      }
      return [...prev, status];
    });
  }, []);

  const handleSendToggle = useCallback((value) => {
    setSendImmediately(value);
  }, []);

  const handleApply = useCallback(async () => {
    setIsLoading(true);
    try {
      await onConfirm({
        statuses: selectedStatuses,
        sendImmediately,
      });

      setSelectedStatuses([]);
      setSendImmediately(false);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatuses, sendImmediately, onConfirm]);

  const handleCancel = useCallback(() => {
    setSelectedStatuses([]);
    setSendImmediately(false);
    onClose();
  }, [onClose]);

  const config = useMemo(() => {
    const configs = {
      [MODAL_TYPES.ACCEPT]: {
        icon: <IconUserRoundCheck width={30} height={30} />,
        iconBg: "#EDFAF5",
        title: I18N[language].changeStatusToAccepted,
        titleHighlight: I18N[language].guestsConfirmed,
        highlightColor: "#02AF8E",
        description: I18N[language].usersWillBeAutomaticallyRegistered,
        statusLabel: I18N[language].specifyStatusesToAccept,
        statuses: [
          {
            key: "pending",
            label: I18N[language].guestsPending,
            color: "#FFAC3A",
            count: guestStats.pending || 0,
          },
          {
            key: "invited",
            label: I18N[language].guestsInvited,
            color: "#6D7F92",
            count: guestStats.invited || 0,
          },
          {
            key: "declined",
            label: I18N[language].guestsDeclined,
            color: "#FC5D2B",
            count: guestStats.declined || 0,
          },
        ],
        confirmationLabel: I18N[language].confirmationRequest,
        sendOptions: [
          { value: true, label: I18N[language].sendImmediately },
          { value: false, label: I18N[language].doNotSend },
        ],
        emailNotice: I18N[language].confirmationEmailWillBeSent,
        buttonLabel: I18N[language].apply,
      },
      [MODAL_TYPES.DECLINE]: {
        icon: <IconUserRoundX width={30} height={30} />,
        iconBg: "#FEDFD5",
        title: I18N[language].changeStatusToDeclined,
        titleHighlight: I18N[language].guestsDeclined,
        highlightColor: "#FC5D2B",
        description: I18N[language].usersWillBeAutomaticallyUnregistered,
        statusLabel: I18N[language].specifyStatusesToDecline,
        statuses: [
          {
            key: "pending",
            label: I18N[language].guestsPending,
            color: "#FFAC3A",
            count: guestStats.pending || 0,
          },
          {
            key: "invited",
            label: I18N[language].guestsInvited,
            color: "#6D7F92",
            count: guestStats.invited || 0,
          },
          {
            key: "confirmed",
            label: I18N[language].guestsConfirmed,
            color: "#02AF8E",
            count: guestStats.confirmed || 0,
          },
        ],
        confirmationLabel: I18N[language].confirmationRequest,
        sendOptions: [
          { value: true, label: I18N[language].sendImmediately },
          { value: false, label: I18N[language].doNotSend },
        ],
        emailNotice: I18N[language].emailWillBeSentForUnregistration,
        buttonLabel: I18N[language].apply,
      },
      [MODAL_TYPES.SEND]: {
        icon: <IconSend width={30} height={30} />,
        iconBg: "#F1F2F4",
        title: I18N[language].sendConfirmationEmails,
        titleHighlight: null,
        highlightColor: null,
        description: I18N[language].usersWillReceiveAdaptedEmail,
        statusLabel: I18N[language].specifyStatusesForEmail,
        statuses: [
          {
            key: "declined",
            label: I18N[language].guestsDeclined,
            color: "#FC5D2B",
            count: guestStats.declined || 0,
          },
          {
            key: "invited",
            label: I18N[language].guestsInvited,
            color: "#6D7F92",
            count: guestStats.invited || 0,
          },
          {
            key: "confirmed",
            label: I18N[language].guestsConfirmed,
            color: "#02AF8E",
            count: guestStats.confirmed || 0,
          },
        ],
        confirmationLabel: null,
        sendOptions: null,
        emailNotice: null,
        buttonLabel: I18N[language].send,
      },
    };

    return configs[type] || configs[MODAL_TYPES.ACCEPT];
  }, [type, guestStats, language]);

  const totalSelected = useMemo(() => {
    return selectedStatuses.reduce((total, status) => {
      const statusData = config.statuses.find((s) => s.key === status);
      return total + (statusData?.count || 0);
    }, 0);
  }, [selectedStatuses, config.statuses]);

  const renderTitle = () => {
    if (config.titleHighlight) {
      const parts = config.title.split(`"${config.titleHighlight}"`);
      return (
        <p className={styles.title}>
          <span>{parts[0]}</span>
          <span style={{ color: config.highlightColor }}>
            "{config.titleHighlight}"
          </span>
          <span>{parts[1]}</span>
        </p>
      );
    }
    return <p className={styles.title}>{config.title}</p>;
  };

  const showEmailNotices = useMemo(() => {
    if (type === MODAL_TYPES.SEND) {
      return selectedStatuses.map((status) => {
        const statusData = config.statuses.find((s) => s.key === status);
        return {
          key: status,
          message: I18N[language].confirmationEmailWillBeSentToStatus.replace(
            "{{status}}",
            statusData?.label || ""
          ),
        };
      });
    }
    return sendImmediately && config.emailNotice
      ? [{ key: "default", message: config.emailNotice }]
      : [];
  }, [
    type,
    sendImmediately,
    config.emailNotice,
    selectedStatuses,
    config.statuses,
    language,
  ]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCancel}
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
      closeTimeoutMS={200}
    >
      <div className={styles.modal}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div
              className={styles.iconWrapper}
              style={{ backgroundColor: config.iconBg }}
            >
              {config.icon}
            </div>
            <div className={styles.headerText}>
              {renderTitle()}
              <p className={styles.description}>{config.description}</p>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <p className={styles.sectionTitle}>{config.statusLabel}</p>
            <div className={styles.statusGrid}>
              {config.statuses.map((status) => (
                <button
                  key={status.key}
                  className={`${styles.statusCard} ${
                    selectedStatuses.includes(status.key) ? styles.selected : ""
                  }`}
                  onClick={() => handleStatusToggle(status.key)}
                  disabled={status.count === 0}
                >
                  <div className={styles.radioButton}>
                    <span
                      className={
                        selectedStatuses.includes(status.key)
                          ? styles.radioActive
                          : ""
                      }
                    />
                  </div>
                  <div className={styles.statusInfo}>
                    <div className={styles.statusHeader}>
                      <span className={styles.statusLabel}>{status.label}</span>
                      <span
                        className={styles.statusDot}
                        style={{ backgroundColor: status.color }}
                      />
                    </div>
                    <span className={styles.statusCount}>
                      {status.count} {I18N[language].users}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <p className={styles.totalCount}>
              {totalSelected} {I18N[language].totalUsers}
            </p>
          </div>

          {config.confirmationLabel && (
            <>
              <div className={styles.divider} />

              <div className={styles.section}>
                <p className={styles.sectionTitle}>
                  {config.confirmationLabel}
                </p>
                <div className={styles.sendOptions}>
                  {config.sendOptions.map((option) => (
                    <button
                      key={option.value.toString()}
                      className={`${styles.sendOption} ${
                        sendImmediately === option.value ? styles.selected : ""
                      }`}
                      onClick={() => handleSendToggle(option.value)}
                    >
                      <div className={styles.radioButton}>
                        <span
                          className={
                            sendImmediately === option.value
                              ? styles.radioActive
                              : ""
                          }
                        />
                      </div>
                      <span className={styles.sendLabel}>{option.label}</span>
                    </button>
                  ))}
                </div>

                {showEmailNotices.length > 0 && (
                  <div className={styles.emailNoticeWrapper}>
                    {showEmailNotices.map((notice) => (
                      <div key={notice.key} className={styles.emailNotice}>
                        <div className={styles.noticeIcon}>
                          <AlertCircle width={20} height={20} fill="#18A0FB" />
                        </div>
                        <div className={styles.noticeText}>
                          <p>{notice.message}</p>
                          <a
                            className={styles.viewEmailLink}
                            href={`${sendingUrl}`}
                            target="_blank"
                          >
                            {I18N[language].viewEmail}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {type === MODAL_TYPES.SEND && showEmailNotices.length > 0 && (
            <div className={styles.section}>
              <div className={styles.emailNoticeWrapper}>
                {showEmailNotices.map((notice) => (
                  <div key={notice.key} className={styles.emailNotice}>
                    <div className={styles.noticeIcon}>
                      <AlertCircle width={20} height={20} fill="#18A0FB" />
                    </div>
                    <div className={styles.noticeText}>
                      <p>{notice.message}</p>
                      <a
                        className={styles.viewEmailLink}
                        href={`${sendingUrl}`}
                        target="_blank"
                      >
                        {I18N[language].viewEmail}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button
            className={styles.cancelButton}
            onClick={handleCancel}
            disabled={isLoading}
          >
            {I18N[language].cancel}
          </button>
          <button
            className={styles.confirmButton}
            onClick={handleApply}
            disabled={totalSelected === 0 || isLoading}
          >
            {isLoading ? (
              <ClipLoader size={16} color="#fff" />
            ) : (
              config.buttonLabel
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

GuestActionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  type: PropTypes.oneOf(Object.values(MODAL_TYPES)).isRequired,
  selectedGuests: PropTypes.array,
  guestStats: PropTypes.shape({
    pending: PropTypes.number,
    confirmed: PropTypes.number,
    declined: PropTypes.number,
  }),
  language: PropTypes.string,
};

export { MODAL_TYPES };
