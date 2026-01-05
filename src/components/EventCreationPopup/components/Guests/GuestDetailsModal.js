import React, { useState, useCallback, useMemo, useEffect } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import Select from "react-select";
import styles from "./GuestDetailsModal.module.scss";
import IconX from "../../../Icons/IconX";
import IconSend from "../../../Icons/IconSendV2";
import IconEdit from "../../../Icons/IconEdit";
import AlertCircle from "../../../Icons/AlertCircle";
import IconCheck from "../../../Icons/IconCheck";
import ClipLoader from "react-spinners/ClipLoader";
import {
  fetchGuestLogs,
  confirmGuestStep,
  forceGuest,
  fetchGuests,
} from "../../../../api";
import moment from "moment";
import { toast } from "react-toastify";
import { STATUS_SELECT_STYLES } from "./services";
import IconCloseBlack from "../../../Icons/IconCloseBlack";
import IconKey from "../../../Icons/IconKey";
import { I18N } from "../../../../i18n";
import cryptoJs from "crypto-js";
import { getOfffcourseUrl } from "../../../../utils/event";

const DropdownIndicator = ({ innerProps, isFocused }) => {
  return (
    <div
      {...innerProps}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 8px",
        transform: isFocused ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.2s",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="11"
        height="7"
        viewBox="0 0 11 7"
        fill="none"
      >
        <path
          d="M10.0833 0.75L5.41667 5.41667L0.75 0.75"
          stroke="#29394D"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>{" "}
    </div>
  );
};

const getActionLabel = (action, language) => {
  if (action.includes("auto-confirm-step-5")) {
    return {
      text: I18N[language].acceptedWithEmail,
      icon: "check",
      type: "accepted",
    };
  }
  if (action.includes("auto-confirm-step-8")) {
    return {
      text: I18N[language].declinedWithEmail,
      icon: "x",
      type: "declined",
    };
  }

  if (action.includes("force-confirm-step-0")) {
    return {
      text: I18N[language].sentInvitationEmail,
      icon: "send",
      type: "invited",
    };
  }
  if (action.includes("force-confirm-step-5")) {
    return {
      text: I18N[language].sentRegistrationEmail,
      icon: "send",
      type: "invited",
    };
  }
  if (action.includes("force-confirm-step-8")) {
    return {
      text: I18N[language].sentCancellationEmail,
      icon: "send",
      type: "invited",
    };
  }

  if (action.includes("confirm-step-5-no-email")) {
    return {
      text: I18N[language].acceptedWithoutEmail,
      icon: "check",
      type: "accepted",
    };
  }
  if (action.includes("confirm-step-8-no-email")) {
    return {
      text: I18N[language].declinedWithoutEmail,
      icon: "x",
      type: "declined",
    };
  }
  if (action.includes("confirm-step-0-no-email")) {
    return {
      text: I18N[language].invitedWithoutEmail,
      icon: "send",
      type: "invited",
    };
  }

  return { text: action, icon: null, type: "default" };
};

export const GuestDetailsModal = ({
  isOpen,
  onClose,
  guest: initialGuest,
  eventId,
  apiUrl,
  token,
  auth,
  getGuestStatus,
  env,
  language,
  fetchGuestsData,
}) => {
  const [isLoadingSendEmail, setIsLoadingSendEmail] = useState(false);
  const [isLoadingStatusChange, setIsLoadingStatusChange] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [guest, setGuest] = useState(initialGuest);
  const [logs, setLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  useEffect(() => {
    setGuest(initialGuest);
  }, [initialGuest]);

  const refetchGuest = useCallback(async () => {
    if (!initialGuest?.id) return;

    try {
      const guestData = await fetchGuests({
        apiUrl,
        token,
        filters: [{ property: "id", operator: "eq", value: initialGuest.id }],
      });

      if (guestData?.data?.[0]) {
        setGuest(guestData.data[0]);
      }
    } catch (error) {
      console.error("Error refetching guest:", error);
    }
  }, [initialGuest?.id, apiUrl, token]);

  const fetchLogsData = useCallback(async () => {
    if (!guest?.id || !isOpen) return;

    setIsLoadingLogs(true);
    try {
      const logsResponse = await fetchGuestLogs({
        guestId: guest.id,
        eventId: guest.event,
        apiUrl,
        token,
      });
      setLogs((logsResponse.data || []).reverse());
    } catch (error) {
      setLogs([]);
    } finally {
      setIsLoadingLogs(false);
    }
  }, [guest?.id, guest?.event, isOpen, apiUrl, token]);

  useEffect(() => {
    fetchLogsData();
  }, [fetchLogsData]);

  useEffect(() => {
    if (guest) {
      const status = getGuestStatus(guest);
      setSelectedStatus(status.key);
    }
  }, [guest, getGuestStatus]);

  const userInscriptionState = useMemo(() => {
    if (!guest) return {};
    return JSON.parse(guest.userInscriptionState || "{}");
  }, [guest]);

  const status = useMemo(() => {
    if (!guest) return null;
    return getGuestStatus(guest);
  }, [guest, getGuestStatus]);

  const unconfirmedMessage = useMemo(() => {
    if (!guest || guest.step === guest.stepConfirmedByEmail) return null;
    const stepMessages = {
      0: I18N[language].invitationNotConfirmed,
      5: I18N[language].registrationNotConfirmed,
      8: I18N[language].cancellationNotConfirmed,
    };
    return stepMessages[guest.step] || null;
  }, [guest, language]);

  const handleCopyAutoLogin = useCallback(() => {
    const usedId = guest.user;
    const eventId = guest.event;
    const offfcourseUrl = getOfffcourseUrl(env);

    const autoLoginUrl = `${offfcourseUrl}/autolog?idApi2=${usedId}&check=${cryptoJs.MD5(
      usedId + "FFFCONTROL"
    )}&eventId=${eventId}`;

    navigator.clipboard.writeText(autoLoginUrl);

    toast.success(I18N[language].linkCopiedToClipboard);
  }, [guest, env, language]);

  const handleSendConfirmation = useCallback(async () => {
    if (!guest) return;

    setIsLoadingSendEmail(true);
    try {
      await confirmGuestStep({
        eventId,
        userId: guest.user,
        step: guest.step,
        apiUrl,
        token,
      });

      await fetchGuestsData();
      await refetchGuest();
      await fetchLogsData();

      toast.success(I18N[language].confirmationEmailSent);
    } catch (error) {
      toast.error(I18N[language].errorSendingEmail);
    } finally {
      setIsLoadingSendEmail(false);
    }
  }, [
    guest,
    eventId,
    apiUrl,
    token,
    language,
    refetchGuest,
    fetchLogsData,
    fetchGuestsData,
  ]);

  const handleStatusChange = useCallback(
    async (option) => {
      if (!guest || !option || option.key === selectedStatus) return;

      const newStatus = option.key;

      setIsLoadingStatusChange(true);
      try {
        const userId = guest.user;
        const statusTypeMap = {
          declined: "decline",
          accepted: "register",
          invited: "add",
        };
        const type = statusTypeMap[newStatus] || "register";

        await forceGuest({
          userIds: [userId],
          eventId,
          fromBackOffice: 1,
          type,
          sendEmail: 0,
          apiUrl,
          token,
        });

        await Promise.all([fetchGuestsData(), refetchGuest(), fetchLogsData()]);

        setSelectedStatus(newStatus);
        toast.success(I18N[language].statusUpdated);
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error(I18N[language].errorUpdatingStatus);
      } finally {
        setIsLoadingStatusChange(false);
      }
    },
    [
      guest,
      selectedStatus,
      eventId,
      apiUrl,
      token,
      refetchGuest,
      fetchLogsData,
      fetchGuestsData,
      language,
    ]
  );

  const formatOptionLabel = useCallback(
    (option) => {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: option.color,
              flexShrink: 0,
            }}
          />
          <span style={{ color: option.color }}>{option.label}</span>
        </div>
      );
    },
    [language]
  );

  const statusOptions = useMemo(() => {
    return [
      {
        key: "pending",
        label: I18N[language].guestsPending,
        color: "#FFAC3A",
        isDisabled: true,
      },
      {
        key: "invited",
        label: I18N[language].guestsInvited,
        color: "#6D7F92",
      },
      {
        key: "accepted",
        label: I18N[language].guestsConfirmed,
        color: "#02AF8E",
      },
      {
        key: "declined",
        label: I18N[language].guestsDeclined,
        color: "#FC5D2B",
      },
    ];
  }, [language]);

  const currentStatusOption = useMemo(() => {
    return statusOptions.find((opt) => opt.key === selectedStatus);
  }, [statusOptions, selectedStatus]);

  const renderActivityIcon = (actionInfo) => {
    const iconMap = {
      accepted: <IconCheck width={12} height={12} />,
      declined: <IconX width={12} height={12} />,
      sent: <IconSend width={12} height={12} />,
      invited: <IconSend width={12} height={12} />,
    };
    return iconMap[actionInfo.type] || null;
  };

  if (!guest) return null;

  const isLoading = isLoadingSendEmail || isLoadingStatusChange;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
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
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <ClipLoader size={40} color="#29394d" />
        </div>
      )}
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <IconEdit width={20} height={20} />
            <span className={styles.headerTitle}>
              {I18N[language].guestDetails}
            </span>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <IconCloseBlack />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.leftPanel}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>
                  {I18N[language].generalData}
                </h3>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  {I18N[language].name}
                </label>
                <p className={styles.fieldValue}>
                  {userInscriptionState.firstName}{" "}
                  {userInscriptionState.lastName}
                </p>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Email</label>
                <p className={styles.fieldValue}>
                  {userInscriptionState.mainEmail}
                </p>
              </div>

              <button
                className={styles.copyButton}
                onClick={handleCopyAutoLogin}
              >
                <IconKey />
                <span>{I18N[language].copyAutoLoginLink}</span>
              </button>

              <div className={styles.divider} />

              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  {I18N[language].registrationStatus}
                </label>
                <Select
                  value={currentStatusOption}
                  options={statusOptions}
                  onChange={handleStatusChange}
                  styles={STATUS_SELECT_STYLES}
                  formatOptionLabel={formatOptionLabel}
                  components={{ DropdownIndicator }}
                  isSearchable={false}
                  getOptionValue={(option) => option.key}
                  menuPlacement="top"
                />
              </div>

              {unconfirmedMessage && (
                <>
                  <div className={styles.divider} />
                  <div className={styles.confirmationSection}>
                    <div className={styles.confirmationNotice}>
                      <AlertCircle width={20} height={20} fill="#18A0FB" />
                      <span>{unconfirmedMessage}</span>
                    </div>
                    <button
                      className={styles.sendButton}
                      onClick={handleSendConfirmation}
                      disabled={isLoadingSendEmail}
                    >
                      <IconSend width={16} height={16} />
                      <span>{I18N[language].sendConfirmation}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.rightPanel}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>
                  {I18N[language].activityHistory}
                </h3>
              </div>

              <div className={styles.activityList}>
                <div className={styles.activityHeader}>
                  <span className={styles.activityHeaderCell}>
                    {I18N[language].user}
                  </span>
                  <span className={styles.activityHeaderCell}>
                    {I18N[language].date}
                  </span>
                  <span className={styles.activityHeaderCell}>
                    {I18N[language].activity}
                  </span>
                </div>

                {isLoadingLogs ? (
                  <div className={styles.activityLoading}>
                    <ClipLoader size={20} color="#29394d" />
                  </div>
                ) : logs.length === 0 ? (
                  <div className={styles.activityEmpty}>
                    <p>{I18N[language].noActivityRecorded}</p>
                  </div>
                ) : (
                  logs.map((log, index) => {
                    const actionInfo = getActionLabel(log.action, language);
                    const isCurrentUser = log.actor == auth?.user?.id;
                    const actorName = isCurrentUser
                      ? I18N[language].you
                      : `${log.firstName || ""} ${log.lastName || ""}`.trim() ||
                        I18N[language].user;

                    return (
                      <div
                        key={log.id}
                        className={`${styles.activityRow} ${
                          index % 2 === 0
                            ? styles.activityRowEven
                            : styles.activityRowOdd
                        }`}
                      >
                        <span className={styles.activityCell}>{actorName}</span>
                        <span className={styles.activityCell}>
                          {moment
                            .utc(log.createdAt)
                            .local()
                            .format("DD/MM/YYYY HH:mm")}
                        </span>
                        <span className={styles.activityCellAction}>
                          {renderActivityIcon(actionInfo)}
                          <span>{actionInfo.text}</span>
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

GuestDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  guest: PropTypes.object,
  eventId: PropTypes.number.isRequired,
  apiUrl: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired,
  getGuestStatus: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
};
