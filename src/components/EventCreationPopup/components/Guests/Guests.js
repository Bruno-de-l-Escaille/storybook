import React, { useCallback, useMemo, useRef, useState } from "react";
import styles from "./Guests.module.scss";
import { fetchGuests, forceGuest, confirmGuestStep } from "../../../../api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiUrl, isEmpty } from "../../../../utils";
import { I18N } from "../../../../i18n";
import cn from "classnames";
import { Search as IconSearch } from "../../../Icons/Search";
import Select from "react-select";
import { SELECT_STYLES } from "./services";
import IconUserRoundPlus from "../../../Icons/IconUserRoundPlus";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import moment from "moment";
import ClipLoader from "react-spinners/ClipLoader";
import IconCheck from "../../../Icons/IconCheck";
import IconX from "../../../Icons/IconX";
import IconSend from "../../../Icons/IconSendV2";
import IconEdit from "../../../Icons/IconEdit";
import IconPolygon from "../../../Icons/IconPolygon";
import IconDownload from "../../../Icons/IconDownload";
import AlertCircle from "../../../Icons/AlertCircle";
import { Pagination } from "../Pagination";
import IconInvites from "../../../Icons/IconInvites";
import { GuestActionModal, MODAL_TYPES } from "./GuestActionModal";
import { GuestDetailsModal } from "./GuestDetailsModal";
import { toast } from "react-toastify";

const DropdownIndicator = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "0" }}>
      <IconPolygon />
    </div>
  );
};

export const Guests = ({ language, data: eventData, env, auth }) => {
  const queryClient = useQueryClient();
  const guestsRef = useRef(null);
  const [filters, setFilters] = useState({
    tab: "all",
    search: "",
    page: 1,
    pageSize: 20,
  });
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [loadingActions, setLoadingActions] = useState({});
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
  });
  const [selectedGuestForEdit, setSelectedGuestForEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // const eventId = eventData.id;
  const eventId = 2293;
  const apiUrl = getApiUrl(env);
  const token = auth.token;

  const getGuestStatus = useCallback((guest) => {
    const step = guest.step;

    if (step === 0) {
      return {
        key: "invited",
        label: "À invité",
        color: "#6D7F92",
      };
    }
    if (step === 5) {
      return {
        key: "accepted",
        label: "Accepté",
        color: "#02AF8E",
      };
    }
    if (step === 8) {
      return {
        key: "declined",
        label: "Décliné",
        color: "#FC5D2B",
      };
    }
    return {
      key: "pending",
      label: "En attente",
      color: "#FFAC3A",
    };
  }, []);

  const { data, isFetching } = useQuery({
    queryKey: ["bo-guests", eventId, apiUrl],
    queryFn: async () => {
      const filters = [
        {
          property: "event.id",
          operator: "eq",
          value: eventId,
        },
      ];
      const guestsData = await fetchGuests({
        filters,
        apiUrl,
        token,
      });

      return guestsData;
    },
    enabled: Boolean(eventId),
  });
  const guests = useMemo(() => data?.data || [], [data]);

  const matchesTab = useCallback(
    (guest, tab) => {
      if (tab === "all") return true;
      const status = getGuestStatus(guest);
      if (tab === "confirmed") return status.key === "accepted";
      if (tab === "declined") return status.key === "declined";
      if (tab === "invited") return status.key === "invited";
      if (tab === "pending") return status.key === "pending";
      return false;
    },
    [getGuestStatus]
  );

  const matchesSearch = useCallback((guest, search) => {
    if (isEmpty(search)) return true;
    return guest.userInscriptionState
      ?.toLowerCase()
      .includes(search.toLowerCase());
  }, []);

  const filteredGuests = useMemo(() => {
    return guests.filter(
      (guest) =>
        matchesTab(guest, filters.tab) && matchesSearch(guest, filters.search)
    );
  }, [guests, filters.tab, filters.search, matchesTab, matchesSearch]);

  const paginatedGuests = useMemo(() => {
    const startIndex = (filters.page - 1) * filters.pageSize;
    const endIndex = startIndex + filters.pageSize;
    return filteredGuests.slice(startIndex, endIndex);
  }, [filteredGuests, filters.page, filters.pageSize]);

  const guestStats = useMemo(() => {
    return {
      all: guests.length,
      confirmed: guests.filter((guest) => matchesTab(guest, "confirmed"))
        .length,
      declined: guests.filter((guest) => matchesTab(guest, "declined")).length,
      pending: guests.filter((guest) => matchesTab(guest, "pending")).length,
      invited: guests.filter((guest) => matchesTab(guest, "invited")).length,
    };
  }, [guests, matchesTab]);

  const selectedGuestsStats = useMemo(() => {
    const selected = guests.filter((guest) =>
      selectedGuests.includes(guest.id)
    );
    return {
      all: selected.length,
      confirmed: selected.filter((guest) => matchesTab(guest, "confirmed"))
        .length,
      declined: selected.filter((guest) => matchesTab(guest, "declined"))
        .length,
      pending: selected.filter((guest) => matchesTab(guest, "pending")).length,
      invited: selected.filter((guest) => matchesTab(guest, "invited")).length,
    };
  }, [guests, selectedGuests, matchesTab]);

  const tabs = useMemo(() => {
    return [
      {
        key: "all",
        label: I18N[language].guestsAll,
        count: guestStats.all,
        noDot: true,
        showTotal: true,
      },
      {
        key: "pending",
        label: I18N[language].guestsPending,
        count: guestStats.pending,
      },
      {
        key: "invited",
        label: "À invités",
        count: guestStats.invited,
      },
      {
        key: "declined",
        label: I18N[language].guestsDeclined,
        count: guestStats.declined,
      },
      {
        key: "confirmed",
        label: I18N[language].guestsConfirmed,
        count: guestStats.confirmed,
      },
    ];
  }, [guestStats, language]);

  // Filter handlers

  const handleFiltersChange = useCallback((updatedFilters) => {
    const isPageChange = "page" in updatedFilters;
    const isSearchChange = "search" in updatedFilters;
    const isTabChange = "tab" in updatedFilters;

    setFilters((prev) => {
      return {
        ...prev,
        ...updatedFilters,
        ...(!isPageChange && { page: 1 }),
      };
    });

    if (isTabChange || isSearchChange) {
      setSelectedGuests([]);
    }
  }, []);

  // Guest action handlers

  const handleAddGuest = useCallback(() => {}, []);

  const handleEditGuest = useCallback((guest) => {
    setSelectedGuestForEdit(guest);
    setIsEditModalOpen(true);
  }, []);

  const handleImportGuests = useCallback(() => {
    const selectedGuestsData = guests.filter((guest) =>
      selectedGuests.includes(guest.id)
    );

    if (selectedGuestsData.length === 0) {
      toast.error("Aucun invité sélectionné");
      return;
    }

    const headers = [
      "Id",
      "Prénom",
      "Nom",
      "Email",
      "Numéro",
      "Langue",
      "Statut",
      "Date d'inscription",
    ];
    const csvRows = [headers.join(",")];
    const languages = {
      fr: "Français",
      en: "Anglais",
      nl: "Néerlandais",
    };

    selectedGuestsData.forEach((guest) => {
      const userInscriptionState = JSON.parse(
        guest.userInscriptionState || "{}"
      );

      const firstName = userInscriptionState.firstName || "";
      const lastName = userInscriptionState.lastName || "";
      const email = userInscriptionState.mainEmail || "";
      const phone = userInscriptionState.mainPhone || "";
      const language = userInscriptionState.language || "";

      const guestStatus = getGuestStatus(guest).label;

      const date = moment
        .utc(guest.purchaseDate)
        .local()
        .format("DD/MM/YY HH:mm");

      const row = [
        `"${guest.id}"`,
        `"${firstName.replace(/"/g, '""')}"`,
        `"${lastName.replace(/"/g, '""')}"`,
        `"${email.replace(/"/g, '""')}"`,
        `"\t${phone.replace(/"/g, '""')}"`,
        `"${languages[language] || ""}"`,
        `"${guestStatus}"`,
        `"\t${date}"`,
      ];

      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invites_${eventId}_${moment().format(
      "YYYY-MM-DD_HH-mm-ss"
    )}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`${selectedGuestsData.length} invité(s) exporté(s)`);
  }, [guests, selectedGuests]);

  const handleSelectGuest = useCallback((guestId) => {
    setSelectedGuests((prev) => {
      if (prev.includes(guestId)) {
        return prev.filter((id) => id !== guestId);
      } else {
        return [...prev, guestId];
      }
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedGuests.length === filteredGuests.length) {
      setSelectedGuests([]);
    } else {
      setSelectedGuests(filteredGuests.map((guest) => guest.id));
    }
  }, [filteredGuests, selectedGuests.length]);

  const handleConfirmGuest = useCallback(
    async (guest) => {
      const loadingKey = `confirm_${guest.id}`;
      try {
        setLoadingActions((prev) => ({ ...prev, [loadingKey]: true }));
        const userId = guest.user;

        await forceGuest({
          userIds: [userId],
          eventId,
          fromBackOffice: 1,
          type: "register",
          apiUrl,
          token,
        });

        queryClient.invalidateQueries({
          queryKey: ["bo-guests"],
        });

        toast.success(I18N[language]["guestAccepted"]);
      } catch (error) {
        toast.error(I18N[language]["errorAcceptingGuest"]);
      } finally {
        setLoadingActions((prev) => ({ ...prev, [loadingKey]: false }));
      }
    },
    [eventId]
  );

  const handleDeclineGuest = useCallback(
    async (guest) => {
      const loadingKey = `decline_${guest.id}`;
      try {
        setLoadingActions((prev) => ({ ...prev, [loadingKey]: true }));

        const userId = guest.user;

        await forceGuest({
          userIds: [userId],
          eventId,
          fromBackOffice: 1,
          type: "decline",
          apiUrl,
          token,
        });

        queryClient.invalidateQueries({
          queryKey: ["bo-guests"],
        });

        toast.success(I18N[language]["guestDeclined"]);
      } catch (error) {
        toast.error(I18N[language]["errorDecliningGuest"]);
      } finally {
        setLoadingActions((prev) => ({ ...prev, [loadingKey]: false }));
      }
    },
    [eventId]
  );

  const handleSendConfirmation = useCallback(async (guest) => {
    const loadingKey = `send_${guest.id}`;
    try {
      setLoadingActions((prev) => ({ ...prev, [loadingKey]: true }));

      await confirmGuestStep({
        eventId,
        userId: guest.user,
        step: guest.step,
        apiUrl,
        token,
      });

      toast.success(I18N[language]["confirmationEmailSent"]);

      queryClient.invalidateQueries({
        queryKey: ["bo-guests"],
      });
    } catch (error) {
      toast.error(I18N[language]["errorSendingEmail"]);
    } finally {
      setLoadingActions((prev) => ({ ...prev, [loadingKey]: false }));
    }
  }, []);

  const handleOpenModal = useCallback((type) => {
    setModalState({
      isOpen: true,
      type,
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalState({
      isOpen: false,
      type: null,
    });
  }, []);

  const handleBulkAction = useCallback(
    async ({ statuses, sendImmediately }) => {
      const { type } = modalState;

      try {
        const guestsToProcess = guests.filter(
          (guest) =>
            selectedGuests.includes(guest.id) &&
            statuses.some((status) => {
              const guestStatus = getGuestStatus(guest);
              if (status === "pending") {
                return guestStatus.key === "pending";
              }
              if (status === "confirmed") {
                return guestStatus.key === "accepted";
              }
              if (status === "declined") {
                return guestStatus.key === "declined";
              }
              if (status === "invited") {
                return guestStatus.key === "invited";
              }
              return false;
            })
        );

        if (type === MODAL_TYPES.ACCEPT) {
          const userIds = guestsToProcess.map((guest) => guest.user);
          await forceGuest({
            userIds,
            eventId,
            fromBackOffice: 1,
            type: "register",
            sendEmail: sendImmediately ? 1 : 0,
            apiUrl,
            token,
          });
        } else if (type === MODAL_TYPES.DECLINE) {
          const userIds = guestsToProcess.map((guest) => guest.user);
          await forceGuest({
            userIds,
            eventId,
            fromBackOffice: 1,
            type: "decline",
            sendEmail: sendImmediately ? 1 : 0,
            apiUrl,
            token,
          });
        } else if (type === MODAL_TYPES.SEND) {
          const promises = guestsToProcess.map((guest) =>
            confirmGuestStep({
              eventId,
              userId: guest.user,
              step: guest.step,
              apiUrl,
              token,
            })
          );
          await Promise.all(promises);
        }

        queryClient.invalidateQueries({
          queryKey: ["bo-guests"],
        });

        setSelectedGuests([]);
        handleCloseModal();

        const actionMessages = {
          [MODAL_TYPES.ACCEPT]: "Invités acceptés avec succès",
          [MODAL_TYPES.DECLINE]: "Invités déclinés avec succès",
          [MODAL_TYPES.SEND]: "Emails de confirmation envoyés avec succès",
        };

        toast.success(actionMessages[type] || "Action effectuée avec succès");
      } catch (error) {
        toast.error("Une erreur s'est produite");
      }
    },
    [
      modalState,
      selectedGuests,
      guests,
      eventId,
      apiUrl,
      token,
      queryClient,
      handleCloseModal,
      getGuestStatus,
    ]
  );

  const shouldShowAction = useCallback(
    (action, guest) => {
      const status = getGuestStatus(guest);

      switch (action) {
        case "accept":
          return status.key !== "accepted";
        case "decline":
          return status.key !== "declined";
        case "send":
          return (
            ["accepted", "declined", "invited"].includes(status.key) &&
            guest.step !== guest.stepConfirmedByEmail
          );
        default:
          return false;
      }
    },
    [getGuestStatus]
  );

  // Rendering functions

  const renderItem = useCallback(
    (guest) => {
      const status = getGuestStatus(guest);

      const userInscriptionState = JSON.parse(
        guest.userInscriptionState || "{}"
      );

      return (
        <tr key={guest.id} className={styles.item} data-id={guest.id}>
          <td className={styles.checkbox}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={selectedGuests.includes(guest.id)}
              onChange={() => handleSelectGuest(guest.id)}
            />
          </td>
          <td className={styles.name}>
            {userInscriptionState.firstName +
              " " +
              userInscriptionState.lastName}
          </td>
          <td className={styles.email}>{userInscriptionState.mainEmail}</td>
          <td className={styles.status}>
            <div className={styles.statusBadge}>
              <span
                className={styles.indicator}
                style={{
                  backgroundColor: status.color,
                }}
              />
              <span
                className={styles.label}
                style={{
                  color: status.color,
                }}
              >
                {status.label}
              </span>
            </div>
          </td>
          <td className={styles.purchaseDate}>
            {status.key === "accepted"
              ? moment.utc(guest.purchaseDate).local().format("DD/MM/YY HH:mm")
              : "-"}
          </td>
          <td className={styles.action}></td>
          <td className={styles.separator}></td>
          <td className={styles.action}>
            {shouldShowAction("accept", guest) && (
              <button
                className={cn(styles.actionButton, styles.confirmButton)}
                onClick={() => handleConfirmGuest(guest)}
                disabled={loadingActions[`confirm_${guest.id}`]}
                data-tooltip="Accepter l'invité"
              >
                {loadingActions[`confirm_${guest.id}`] ? (
                  <ClipLoader size={10} color="#02AF8E" />
                ) : (
                  <IconCheck />
                )}
              </button>
            )}
          </td>
          <td className={styles.action}>
            {shouldShowAction("decline", guest) && (
              <button
                className={cn(styles.actionButton, styles.declineButton)}
                onClick={() => handleDeclineGuest(guest)}
                disabled={loadingActions[`decline_${guest.id}`]}
                data-tooltip="Décliner l'invité"
              >
                {loadingActions[`decline_${guest.id}`] ? (
                  <ClipLoader size={10} color="#FC5D2B" />
                ) : (
                  <IconX />
                )}
              </button>
            )}
          </td>
          <td className={styles.separator}>
            <span />
          </td>
          <td className={styles.action}>
            {shouldShowAction("send", guest) && (
              <button
                className={styles.actionButton}
                onClick={() => handleSendConfirmation(guest)}
                disabled={loadingActions[`send_${guest.id}`]}
                data-tooltip={
                  status.key === "accepted"
                    ? "Envoyer l'email d'inscription"
                    : status.key === "declined"
                    ? "Envoyer l'email d'annulation"
                    : "Envoyer l'email d'invitation"
                }
              >
                {loadingActions[`send_${guest.id}`] ? (
                  <ClipLoader size={10} color="#29394d" />
                ) : (
                  <IconSend />
                )}
              </button>
            )}
          </td>
          <td className={styles.action}>
            <button
              className={styles.actionButton}
              onClick={() => handleEditGuest(guest)}
            >
              <IconEdit />
            </button>
          </td>
        </tr>
      );
    },
    [
      handleSelectGuest,
      selectedGuests,
      handleConfirmGuest,
      handleDeclineGuest,
      handleSendConfirmation,
      loadingActions,
      getGuestStatus,
      handleEditGuest,
      shouldShowAction,
    ]
  );

  const renderItemFetching = (key) => (
    <SkeletonTheme key={key}>
      <tr className={cn(styles.item, styles.fetching)}>
        <td className={styles.checkbox}>
          <Skeleton />
        </td>
        <td className={styles.name}>
          <Skeleton />
        </td>
        <td className={styles.email}>
          <Skeleton />
        </td>
        <td className={styles.status}>
          <Skeleton />
        </td>
        <td className={styles.purchaseDate}>
          <Skeleton />
        </td>
        <td colSpan={7}>
          <Skeleton />
        </td>
      </tr>
    </SkeletonTheme>
  );

  const renderItems = useCallback(() => {
    if (isFetching) {
      return <>{[1, 2, 3, 4, 5].map(renderItemFetching)}</>;
    }

    return <>{paginatedGuests.map(renderItem)}</>;
  }, [paginatedGuests, isFetching, renderItem]);

  const renderSelectionRow = () => {
    const isAllGuestsSelected =
      selectedGuests.length === filteredGuests.length &&
      filteredGuests.length > 0;

    if (selectedGuests.length === 0) {
      return (
        <button className={styles.selectionButton} onClick={handleSelectAll}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={isAllGuestsSelected}
            onChange={handleSelectAll}
          />
          <span>Sélectionner tous</span>
        </button>
      );
    }

    const selectedGuestsData = guests.filter((guest) =>
      selectedGuests.includes(guest.id)
    );
    const canAccept = selectedGuestsData.some((guest) =>
      shouldShowAction("accept", guest)
    );
    const canDecline = selectedGuestsData.some((guest) =>
      shouldShowAction("decline", guest)
    );
    const canSend = selectedGuestsData.some((guest) =>
      shouldShowAction("send", guest)
    );

    const showSeparatorBefore = canAccept || canDecline;
    const showSeparatorAfter = canSend;

    return (
      <div className={styles.selectionRow}>
        <div className={styles.left} onClick={handleSelectAll}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={isAllGuestsSelected}
            onChange={handleSelectAll}
          />
          <span>
            {isAllGuestsSelected ? "Désélectionner tous" : "Sélectionner tous"}
          </span>
        </div>
        <span className={styles.center}>
          {selectedGuests.length} éléments sélectionnées
        </span>
        <div className={styles.right}>
          <div className={styles.actionWrapper}>
            <button
              className={styles.actionButton}
              onClick={handleImportGuests}
              data-tooltip="Télécharger la sélection en .csv"
            >
              <IconDownload />
            </button>
          </div>
          <div className={styles.separatorWrapper}>
            {showSeparatorBefore && <span className={styles.separator} />}
          </div>
          <div className={styles.actionWrapper}>
            {canAccept && (
              <button
                className={cn(styles.actionButton, styles.confirmButton)}
                onClick={() => handleOpenModal(MODAL_TYPES.ACCEPT)}
                data-tooltip="Accepté la sélection"
              >
                <IconCheck />
              </button>
            )}
          </div>
          <div className={styles.actionWrapper}>
            {canDecline && (
              <button
                className={cn(styles.actionButton, styles.declineButton)}
                onClick={() => handleOpenModal(MODAL_TYPES.DECLINE)}
                data-tooltip="Décliné la sélection"
              >
                <IconX />
              </button>
            )}
          </div>
          <div className={styles.separatorWrapper}>
            {showSeparatorAfter && <span className={styles.separator} />}
          </div>
          <div className={styles.actionWrapper}>
            {canSend && (
              <button
                className={styles.actionButton}
                onClick={() => handleOpenModal(MODAL_TYPES.SEND)}
                data-tooltip="Envoyer les emails de confirmation (inscription/annulation/invitation) à la sélection"
              >
                <IconSend />
              </button>
            )}
          </div>
          <div className={styles.actionWrapper} />
        </div>
      </div>
    );
  };

  const renderEmptyState = () => {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateContent}>
          <div className={styles.emptyStateIcon}>
            <AlertCircle width={20} height={20} fill="#18A0FB" />
          </div>
          <p className={styles.emptyStateTitle}>
            Vous pouvez ajouter vos invités manuellement.
          </p>
          <div className={styles.emptyStateDescription}>
            <p>
              Cette option vous permet d'ajouter rapidement des personnes à
              votre événement.
            </p>
            <p>
              Il vous sera également possible de choisir si vous souhaitez
              envoyer une confirmation à vos invités.
            </p>
          </div>
        </div>
        <button className={styles.addButton} onClick={handleAddGuest}>
          <IconUserRoundPlus />
          <span>Ajouter des invités</span>
        </button>
      </div>
    );
  };

  const renderNoData = () => {
    return (
      <div className={styles.noData}>
        <div className={styles.iconWrapper}>
          <IconInvites width={20} height={20} />
        </div>
        <h5>Aucun invité ne correspond à vos filtres.</h5>
      </div>
    );
  };

  // Main render

  return (
    <div className={styles.guests} ref={guestsRef}>
      {!isFetching && guests.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <div className={styles.tabs}>
            {tabs.map((t) => (
              <div
                className={cn(styles.tab, styles[t.key], {
                  [styles.active]: t.key === filters.tab,
                })}
                key={t.key}
                onClick={() => handleFiltersChange({ tab: t.key })}
              >
                <div className={styles.title}>
                  <span className={styles.label}>{t.label}</span>
                  {!t.noDot && <span className={styles.dot} />}
                </div>
                <div className={styles.count}>
                  <span className={styles.value}>{t.count}</span>
                  {t.showTotal && (
                    <span className={styles.total}>/ {guestStats.all}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.filters}>
            <button className={styles.addButton} onClick={handleAddGuest}>
              <IconUserRoundPlus />
              <span>Ajouter des invités</span>
            </button>
            <div className={styles.right}>
              <div className={styles.searchContainer}>
                <IconSearch />
                <input
                  type="text"
                  placeholder={"Rechercher"}
                  value={filters.search}
                  onChange={(e) =>
                    handleFiltersChange({ search: e.target.value })
                  }
                />
              </div>
              <Select
                options={[
                  { value: 10, label: "10" },
                  { value: 20, label: "20" },
                  { value: 50, label: "50" },
                  { value: 100, label: "100" },
                ]}
                value={{
                  value: filters.pageSize,
                  label: filters.pageSize.toString(),
                }}
                onChange={(selected) => {
                  handleFiltersChange({ pageSize: selected.value });
                }}
                styles={SELECT_STYLES}
                components={{ DropdownIndicator }}
                isSearchable={false}
              />
            </div>
          </div>
          {isFetching || filteredGuests.length > 0 ? (
            <>
              <div className={styles.list}>
                {!isFetching && renderSelectionRow()}
                <table className={styles.items}>
                  <thead>
                    <tr>
                      <th />
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Statut</th>
                      <th>Date d'inscription</th>
                      <th colSpan={7} />
                    </tr>
                  </thead>
                  <tbody>{renderItems()}</tbody>
                </table>
              </div>
              <Pagination
                total={filteredGuests.length}
                pageSize={filters.pageSize}
                current={filters.page}
                onChange={(page) => {
                  handleFiltersChange({ page });
                  // Scroll to top of the modal content
                  if (guestsRef.current) {
                    const scrollableParent = guestsRef.current.parentElement;
                    if (scrollableParent) {
                      scrollableParent.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }
                }}
                className={styles.pagination}
                language={language}
              />
            </>
          ) : (
            renderNoData()
          )}
        </>
      )}

      <GuestActionModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleBulkAction}
        type={modalState.type}
        guestStats={selectedGuestsStats}
      />

      <GuestDetailsModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedGuestForEdit(null);
        }}
        guest={selectedGuestForEdit}
        eventId={eventId}
        apiUrl={apiUrl}
        token={token}
        auth={auth}
        getGuestStatus={getGuestStatus}
        language={language}
      />
    </div>
  );
};
