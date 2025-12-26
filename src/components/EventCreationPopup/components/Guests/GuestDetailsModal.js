import React, { useState, useCallback, useMemo, useEffect } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import Select from "react-select";
import styles from "./GuestDetailsModal.module.scss";
import IconX from "../../../Icons/IconX";
import IconSend from "../../../Icons/IconSendV2";
import IconEdit from "../../../Icons/IconEdit";
import IconPolygon from "../../../Icons/IconPolygon";
import AlertCircle from "../../../Icons/AlertCircle";
import IconCheck from "../../../Icons/IconCheck";
import ClipLoader from "react-spinners/ClipLoader";
import { fetchGuestLogs, confirmGuestStep, forceGuest } from "../../../../api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { toast } from "react-toastify";

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

const SELECT_STYLES = {
  control: (base, state) => ({
    ...base,
    minHeight: "32px",
    height: "32px",
    borderColor: state.menuIsOpen ? "#29394d" : "#b2bcc6",
    borderWidth: "0.5px",
    borderRadius: "8px",
    boxShadow: "none",
    cursor: "pointer",
    "&:hover": {
      borderColor: state.menuIsOpen ? "#29394d" : "#b2bcc6",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    height: "32px",
    padding: "0 10px",
  }),
  input: (base) => ({
    ...base,
    margin: "0",
    padding: "0",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: "32px",
  }),
  menu: (base) => ({
    ...base,
    marginTop: "4px",
    borderRadius: "8px",
    border: "0.5px solid #e1e4e8",
    boxShadow: "0 4px 12px rgba(41, 57, 77, 0.1)",
  }),
  menuList: (base) => ({
    ...base,
    padding: "4px",
    borderRadius: "8px",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isDisabled
      ? "white"
      : state.isSelected
      ? "#f3faff"
      : state.isFocused
      ? "#f4f7f9"
      : "white",
    color: state.isDisabled ? "#b2bcc6" : "#29394d",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    padding: "8px 10px",
    borderRadius: "6px",
    margin: "2px 0",
    fontSize: "12px",
    fontFamily: "Roboto, sans-serif",
    fontWeight: 600,
    opacity: state.isDisabled ? 0.6 : 1,
    "&:active": {
      backgroundColor: state.isDisabled ? "white" : "#f3faff",
    },
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: "12px",
    fontFamily: "Roboto, sans-serif",
    fontWeight: 600,
    margin: 0,
  }),
};

const getActionLabel = (action) => {
  if (action.includes("force-confirm-step-5")) {
    return { text: "A accepté", icon: "check", type: "accepted" };
  }
  if (action.includes("force-confirm-step-8")) {
    return { text: "A décliné", icon: "x", type: "declined" };
  }
  if (action.includes("confirm-step")) {
    return { text: "A envoyé une confirmation", icon: "send", type: "sent" };
  }
  if (action.includes("force-add")) {
    return { text: "A invité", icon: "send", type: "invited" };
  }
  return { text: action, icon: null, type: "default" };
};

export const GuestDetailsModal = ({
  isOpen,
  onClose,
  guest,
  eventId,
  apiUrl,
  token,
  auth,
  getGuestStatus,
  language,
}) => {
  const queryClient = useQueryClient();
  const [isLoadingSendEmail, setIsLoadingSendEmail] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const { data: logsData, isFetching: isLoadingLogs } = useQuery({
    queryKey: ["guest-logs", guest?.id, apiUrl],
    queryFn: async () => {
      const logs = await fetchGuestLogs({
        guestId: guest.id,
        apiUrl,
        token,
      });
      return logs;
    },
    enabled: Boolean(guest?.id && isOpen),
  });

  const logs = useMemo(() => logsData?.data || [], [logsData]);

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

  const isConfirmed = useMemo(() => {
    if (!guest) return false;
    return guest.step === guest.stepConfirmedByEmail;
  }, [guest]);

  const handleCopyAutoLogin = useCallback(() => {
    // TODO: Implement auto-login URL copy
    toast.success("Lien copié dans le presse-papiers");
  }, []);

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

      queryClient.invalidateQueries({
        queryKey: ["bo-guests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["guest-logs", guest.id],
      });

      toast.success("Email de confirmation envoyé");
    } catch (error) {
      toast.error("Erreur lors de l'envoi de l'email");
    } finally {
      setIsLoadingSendEmail(false);
    }
  }, [guest, eventId, apiUrl, token, queryClient]);

  const handleStatusChange = useCallback(
    async (option) => {
      if (!guest || !option || option.key === selectedStatus) return;

      const newStatus = option.key;

      try {
        const userId = guest.user;
        let type = "register";

        if (newStatus === "declined") {
          type = "decline";
        } else if (newStatus === "accepted") {
          type = "register";
        }

        await forceGuest({
          userIds: [userId],
          eventId,
          fromBackOffice: 1,
          type,
          sendEmail: 0,
          apiUrl,
          token,
        });

        queryClient.invalidateQueries({
          queryKey: ["bo-guests"],
        });
        queryClient.invalidateQueries({
          queryKey: ["guest-logs", guest.id],
        });

        setSelectedStatus(newStatus);
        toast.success("Statut mis à jour");
      } catch (error) {
        toast.error("Erreur lors de la mise à jour du statut");
      }
    },
    [guest, selectedStatus, eventId, apiUrl, token, queryClient]
  );

  const formatOptionLabel = useCallback((option) => {
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
  }, []);

  const statusOptions = useMemo(() => {
    return [
      {
        key: "pending",
        label: "En attente",
        color: "#FFAC3A",
        isDisabled: true,
      },
      {
        key: "invited",
        label: "À invité",
        color: "#6D7F92",
      },
      {
        key: "accepted",
        label: "Accepté",
        color: "#02AF8E",
      },
      {
        key: "declined",
        label: "Décliné",
        color: "#FC5D2B",
      },
    ];
  }, []);

  const currentStatusOption = useMemo(() => {
    return statusOptions.find((opt) => opt.key === selectedStatus);
  }, [statusOptions, selectedStatus]);

  const renderActivityIcon = (actionInfo) => {
    if (actionInfo.type === "accepted") {
      return <IconCheck width={12} height={12} />;
    }
    if (actionInfo.type === "declined") {
      return <IconX width={12} height={12} />;
    }
    if (actionInfo.type === "sent" || actionInfo.type === "invited") {
      return <IconSend width={12} height={12} />;
    }
    return null;
  };

  if (!guest) return null;

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
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <IconEdit width={20} height={20} />
            <span className={styles.headerTitle}>Détails de l'invité</span>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <IconX width={20} height={20} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.leftPanel}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Données générales</h3>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Nom</label>
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
                <IconEdit width={16} height={16} />
                <span>Copier le lien d'auto-login</span>
              </button>

              <div className={styles.divider} />

              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  Statut d'inscription
                </label>
                <Select
                  value={currentStatusOption}
                  options={statusOptions}
                  onChange={handleStatusChange}
                  styles={SELECT_STYLES}
                  formatOptionLabel={formatOptionLabel}
                  components={{ DropdownIndicator }}
                  isSearchable={false}
                  getOptionValue={(option) => option.key}
                />
              </div>

              <div className={styles.divider} />

              {!isConfirmed && (
                <div className={styles.confirmationSection}>
                  <div className={styles.confirmationNotice}>
                    <AlertCircle width={20} height={20} fill="#18A0FB" />
                    <span>Son inscription n'est pas confirmée</span>
                  </div>
                  <button
                    className={styles.sendButton}
                    onClick={handleSendConfirmation}
                    disabled={isLoadingSendEmail}
                  >
                    {isLoadingSendEmail ? (
                      <ClipLoader size={12} color="#29394d" />
                    ) : (
                      <>
                        <IconSend width={16} height={16} />
                        <span>Envoyer la confirmation</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.rightPanel}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>
                  Historique des activités
                </h3>
              </div>

              <div className={styles.activityList}>
                <div className={styles.activityHeader}>
                  <span className={styles.activityHeaderCell}>Utilisateur</span>
                  <span className={styles.activityHeaderCell}>Date</span>
                  <span className={styles.activityHeaderCell}>Activité</span>
                </div>

                {isLoadingLogs ? (
                  <div className={styles.activityLoading}>
                    <ClipLoader size={20} color="#29394d" />
                  </div>
                ) : logs.length === 0 ? (
                  <div className={styles.activityEmpty}>
                    <p>Aucune activité enregistrée</p>
                  </div>
                ) : (
                  logs.map((log, index) => {
                    const actionInfo = getActionLabel(log.action);
                    const isCurrentUser =
                      log.actor === auth?.id || log.actor === auth?.user?.id;
                    const actorName = isCurrentUser
                      ? "Vous"
                      : `${log.firstName || ""} ${log.lastName || ""}`.trim() ||
                        "Utilisateur";

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
                          {moment(log.createdAt).format("DD/MM/YYYY HH:mm")}
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
