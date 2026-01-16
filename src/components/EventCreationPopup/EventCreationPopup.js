import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import styles from "./EventCreationPopup.module.scss";
import { I18N } from "../../i18n";
import IconMaximize from "../Icons/IconMaximize";
import IconDots from "../Icons/IconDots";
import IconCloseBlack from "../Icons/IconCloseBlack";
import IconPenEdit from "../Icons/IconPenEdit";
import IconConfig from "../Icons/IconConfig";
import IconInvites from "../Icons/IconInvites";
import IconTickets from "../Icons/IconTickets";
import { Editor } from "./components/Editor";
import { Config } from "./components/Config";
import { Guests } from "./components/Guests";
import { Tickets } from "./components/Tickets";
import IconArrowWhite from "../Icons/IconArrowWhite";
import { getApiUrl, isEmpty, prepareS3ResourceUrl } from "../../utils";
import IconArrowBlack from "../Icons/IconArrowBlack";
import {
  getEvent,
  saveEventLight,
  uploadMedia,
  getTags,
  saveEventAuthor,
  deleteSpeaker,
  fetchLabelTemplates,
  deleteEvent,
  duplicateEvent,
  fetchCommand,
} from "../../api";
import { Toast, FlashMessage } from "../ToastContainer/ToastContainer";
import { ClipLoader } from "react-spinners";
import { ModalConfirm } from "../Modal/ModalConfirm";

export const EventCreationPopup = (props) => {
  const {
    isOpen,
    onClose,
    language,
    env,
    auth,
    clientId,
    eventId,
    eventStep,
    refreshEventsData,
  } = props;
  const [step, setStep] = useState(eventStep || 0);
  const [tags, setTags] = useState([]);
  const [speakersToDelete, setSpeakersToDelete] = useState([]);
  const [labelTemplates, setLabelTemplates] = useState([]);
  const [showDotsMenu, setShowDotsMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDuplicateConfirm, setShowDuplicateConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [data, setData] = useState({
    eventId: eventId || 0,
    nameFr: "",
    nameNl: "",
    nameEn: "",
    descriptionFr: "",
    descriptionNl: "",
    descriptionEn: "",
    image: "",
    imageFile: null,
    urlBannerFr: "",
    urlBannerNl: "",
    urlBannerEn: "",
    startDateTime: "",
    endDateTime: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    placeFr: "",
    placeNl: "",
    placeEn: "",
    maxPlaces: "",
    status: "2",
    labelFr: "",
    labelNl: "",
    labelEn: "",
    tag: [],
    contactFr: "",
    contactNl: "",
    contactEn: "",
    emailContactFr: "",
    emailContactNl: "",
    emailContactEn: "",
    phoneNumberContactFr: "",
    phoneNumberContactNl: "",
    phoneNumberContactEn: "",
    type: 7,
    isVirtual: 0,
    languages: {
      Fr: language === "fr" ? "1" : 0,
      Nl: language === "nl" ? "1" : 0,
      En: language === "en" ? "1" : 0,
    },
    client: clientId,
    stages: {
      inscription: "true",
      payBank: "false",
      payOnline: "false",
      printBadge: "false",
      printProgramOnBadge: "false",
      autoActivateInvitePartOnSave: "false",
      lmFull: "admin",
      showSupports: "false",
      Evaluation: "true",
      showProgram: "false",
      showLiberFormMessage: "false",
      showOffProgram: "false",
      showOrateurs: "false",
      showAttestationUser: "false",
      showAttestationForce: "false",
      showAttestation: "false",
      hideProgramInAttestation: "false",
      showSpeedCoaching: "false",
      forceModifPrinted: "false",
      showActivitiesList: "false",
      chooseByActivities: "false",
      fullProgram: "true",
      alwaysDisplayDateProgram: "false",
      doScanSlots: "false",
      attestationOnlyProgram: "false",
      useMemberCard: "false",
      showGeneral: "false",
      showSpeakers: "false",
      showMaps: "true",
      useOldBanner: "false",
      showMeetingsFrontMenu: "false",
      showMobileApps: "true",
      noInvoicing: "false",
    },
    template: "unify",
    slots: [],
  });
  const [selectedSpeakers, setSelectedSpeakers] = useState([]);
  const [validationErrors, setValidationErrors] = useState({
    titleError: false,
    dateError: false,
    startTimeError: false,
    endTimeError: false,
    timeComparisonError: false,
    addressError: false,
    maxPlacesError: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [maximize, setMaximize] = useState(false);
  const apiUrl = getApiUrl(env);
  const s3FolderUrl = `https://s3.tamtam.pro/${
    env === "v2" ? "production" : env
  }`;

  const processLightSlot = (eventData) => {
    const languages = {
      Fr: language === "fr" ? "1" : 0,
      Nl: language === "nl" ? "1" : 0,
      En: language === "en" ? "1" : 0,
    };

    const startDate = new Date(`${eventData.eventDate} ${eventData.startTime}`);
    const endDate = new Date(`${eventData.eventDate} ${eventData.endTime}`);
    const durationMinutes =
      Math.round((Math.abs(endDate - startDate) / 60000) * 100) / 100;

    const slot = {
      nameFr: eventData.nameFr,
      nameNl: eventData.nameNl,
      nameEn: eventData.nameEn,
      startDateTime: eventData.startDateTime,
      endDateTime: eventData.endDateTime,
      status: 2,
      full: true,
      placesNumber: eventData.maxPlaces,
      languages: JSON.stringify(languages),
      isPostPlayVideo: 0,
      room: "",
      activity: "",
      duration: durationMinutes,
    };

    return slot;
  };

  const tabs = [
    {
      id: 0,
      label: I18N[language]["editor"],
      icon: <IconPenEdit />,
    },
    {
      id: 1,
      label: I18N[language]["configuration"],
      icon: <IconConfig />,
    },
    {
      id: 2,
      label: I18N[language]["guests"],
      icon: <IconInvites />,
    },
    {
      id: 3,
      label: I18N[language]["tickets"],
      icon: <IconTickets />,
    },
  ];

  useEffect(() => {
    if (eventId > 0) {
      getEvent({ apiUrl, token: auth.token, eventId }).then((resp) => {
        const eventData = resp.data.data[0];

        const startTime = eventData.startDateTime
          ? eventData.startDateTime.split(" ")[1].slice(0, 5)
          : "";
        const endTime = eventData.endDateTime
          ? eventData.endDateTime.split(" ")[1].slice(0, 5)
          : "";

        setData({
          eventId: eventData.id,
          nameFr: eventData.nameFr || "",
          nameNl: eventData.nameNl || "",
          nameEn: eventData.nameEn || "",
          descriptionFr: eventData.descriptionFr || "",
          descriptionNl: eventData.descriptionNl || "",
          descriptionEn: eventData.descriptionEn || "",
          urlBannerFr: eventData.urlBannerFr || "",
          urlBannerNl: eventData.urlBannerNl || "",
          urlBannerEn: eventData.urlBannerEn || "",
          startDateTime: eventData.startDateTime || "",
          endDateTime: eventData.endDateTime || "",
          startTime: startTime,
          endTime: endTime,
          eventDate: eventData.eventDate || "",
          placeFr: eventData.placeFr || "",
          placeNl: eventData.placeNl || "",
          placeEn: eventData.placeEn || "",
          maxPlaces: eventData.maxNumber || "",
          status: eventData.status ? eventData.status.toString() : "2",
          client: eventData.client,
          type: eventData.type || 7,
          isVirtual: eventData.isVirtual || 0,
          contactFr: eventData.contactFr || "",
          contactNl: eventData.contactNl || "",
          contactEn: eventData.contactEn || "",
          emailContactFr: eventData.emailContactFr || "",
          emailContactNl: eventData.emailContactNl || "",
          emailContactEn: eventData.emailContactEn || "",
          phoneNumberContactFr: eventData.phoneNumberContactFr || "",
          phoneNumberContactNl: eventData.phoneNumberContactNl || "",
          phoneNumberContactEn: eventData.phoneNumberContactEn || "",
          labelFr: eventData.labelFr || "",
          labelNl: eventData.labelNl || "",
          labelEn: eventData.labelEn || "",
          tag: eventData.tag || [],
          slotId: eventData.slotIds?.[0] || 0,
          image:
            prepareS3ResourceUrl(
              s3FolderUrl,
              language === "fr" && !isEmpty(eventData.urlBannerFr)
                ? eventData.urlBannerFr
                : language === "nl" && !isEmpty(eventData.urlBannerNl)
                ? eventData.urlBannerNl
                : language === "en" && !isEmpty(eventData.urlBannerEn)
                ? eventData.urlBannerEn
                : ""
            ) || "",
        });
        const retrievedSpeakers =
          eventData["speakers-abstract"].speakers.map((speaker) => ({
            ...speaker,
            isExisting: true,
          })) || [];

        if (retrievedSpeakers.length > 0) {
          const mappedSpeakers = retrievedSpeakers.map((speaker) => {
            return {
              id: Number(speaker.id),
              isExisting: true,
              user: {
                avatar: !speaker.pictureUrl.includes("/IMAGE//")
                  ? speaker.pictureUrl
                  : "",
                firstName: speaker.firstName,
                lastName: speaker.lastName,
              },
              headlineFr: speaker.headlineFr
                ? typeof speaker.headlineFr === "string"
                  ? JSON.parse(speaker.headlineFr)
                  : speaker.headlineFr
                : { title: "" },
              headlineNl: speaker.headlineNl
                ? typeof speaker.headlineNl === "string"
                  ? JSON.parse(speaker.headlineNl)
                  : speaker.headlineNl
                : { title: "" },
              headlineEn: speaker.headlineEn
                ? typeof speaker.headlineEn === "string"
                  ? JSON.parse(speaker.headlineEn)
                  : speaker.headlineEn
                : { title: "" },
            };
          });
          setSelectedSpeakers(mappedSpeakers);
        }
      });
    }
  }, []);

  useEffect(() => {
    getTags({ token: auth.token, language, customFilter: null, apiUrl }).then(
      (resp) => {
        setTags(resp.data.data || []);
      }
    );
  }, []);

  useEffect(() => {
    fetchLabelTemplates({
      token: auth.token,
      apiUrl,
    }).then((resp) => {
      setLabelTemplates(resp.data || []);
    });
  }, []);

  const checkValidations = () => {
    if (step === 0) {
      let hasError = false;
      const newErrors = { ...validationErrors };

      const titleField = `name${
        language.charAt(0).toUpperCase() + language.slice(1)
      }`;
      if (isEmpty(data[titleField])) {
        newErrors.titleError = true;
        hasError = true;
      }

      if (hasError) {
        setValidationErrors(newErrors);
        return false;
      }
    } else if (step === 1) {
      let hasError = false;
      const newErrors = { ...validationErrors };

      if (isEmpty(data.eventDate)) {
        newErrors.dateError = true;
        hasError = true;
      }

      if (isEmpty(data.startTime)) {
        newErrors.startTimeError = true;
        hasError = true;
      }

      if (isEmpty(data.endTime)) {
        newErrors.endTimeError = true;
        hasError = true;
      }

      if (!hasError && data.startTime && data.endTime) {
        const [startHour, startMin] = data.startTime.split(":").map(Number);
        const [endHour, endMin] = data.endTime.split(":").map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        if (endMinutes <= startMinutes) {
          newErrors.timeComparisonError = true;
          hasError = true;
        }
      }

      const placeField = `place${
        language.charAt(0).toUpperCase() + language.slice(1)
      }`;
      if (isEmpty(data[placeField])) {
        newErrors.addressError = true;
        hasError = true;
      }

      if (isEmpty(data.maxPlaces)) {
        newErrors.maxPlacesError = true;
        hasError = true;
      }

      if (hasError) {
        setValidationErrors(newErrors);
        return false;
      }
    }

    return true;
  };

  const uploadImage = (eventId) => {
    return uploadMedia({
      apiUrl,
      token: auth.token,
      data: data.imageFile,
      filePath: `/events-folder/client${clientId}/event${eventId}/_model/html/img`,
    })
      .then((resp) => {
        const imagePath = ("/" + resp.data.data.image_path).replace(
          "events-folder",
          "eventsFolder"
        );
        let urlBannerField = "";

        if (language === "fr") {
          urlBannerField = "urlBannerFr";
        } else if (language === "nl") {
          urlBannerField = "urlBannerNl";
        } else if (language === "en") {
          urlBannerField = "urlBannerEn";
        }

        setData((prevData) => ({
          ...prevData,
          [urlBannerField]: imagePath,
        }));

        return { urlBannerField, imagePath };
      })
      .catch((e) => {
        Toast.error(I18N[language]["errorUploadingImage"]);
        throw e;
      });
  };

  const saveSpeakersToSlot = (eventId) => {
    if (!selectedSpeakers || selectedSpeakers.length === 0) {
      return Promise.resolve();
    }
    const newSpeakers = selectedSpeakers.filter(
      (speaker) =>
        !speaker.isExisting &&
        !speakersToDelete.some((s) => s.id === speaker.id)
    );
    if (newSpeakers.length === 0) {
      return Promise.resolve();
    }

    const eventAuthorPromises = newSpeakers.map((speaker) => {
      const eventAuthorData = {
        author: speaker.id,
        event: eventId,
        priority: 0,
        isValid: 1,
        headLineFr: speaker.headLineFr || "",
        headLineNl: speaker.headLineNl || "",
        headLineEn: speaker.headLineEn || "",
      };

      return saveEventAuthor({
        apiUrl,
        token: auth.token,
        data: eventAuthorData,
      }).then((resp) => ({
        eventAuthorId: resp.data.data.id,
        authorId: speaker.id,
      }));
    });

    return Promise.all(eventAuthorPromises)
      .then((eventAuthors) => {
        const speakers = eventAuthors.map((eventAuthor) => {
          return {
            orateur: {
              id: eventAuthor.eventAuthorId,
              author: eventAuthor.authorId,
            },
            type: 1,
            priority: 0,
          };
        });

        return { speakers };
      })
      .catch((e) => {
        Toast.error(I18N[language]["errorSavingSpeakers"]);
        throw e;
      });
  };

  const deleteSpeakersMarkedForDeletion = (eventId) => {
    if (speakersToDelete.length === 0) {
      return Promise.resolve();
    }

    const deletePromises = speakersToDelete.map((speaker) => {
      return deleteSpeaker({
        apiUrl,
        token: auth.token,
        eventId: eventId,
        authorId: speaker.id,
      });
    });

    return Promise.all(deletePromises)
      .then(() => {
        setSpeakersToDelete([]);
      })
      .catch((error) => {
        Toast.error(I18N[language]["errorDeletingSpeakers"]);
        throw error;
      });
  };

  const handleSave = () => {
    const validated = checkValidations();
    if (!validated) return Promise.reject("Validation failed");

    setIsSaving(true);

    return saveEventLight({ apiUrl, token: auth.token, data: data })
      .then((resp) => {
        const savedEventId = data.eventId || resp.data.data.id;

        setData((prevData) => ({
          ...prevData,
          eventId: savedEventId,
        }));

        const promises = [];
        if (data.imageFile) {
          promises.push(uploadImage(savedEventId));
        }
        if (selectedSpeakers && selectedSpeakers.length > 0) {
          promises.push(saveSpeakersToSlot(savedEventId));
        }
        if (promises.length > 0) {
          return Promise.all(promises).then((results) => ({
            results,
            savedEventId,
          }));
        }
        return Promise.resolve({ results: [], savedEventId });
      })
      .then(({ results, savedEventId }) => {
        const hasNewImage = results.some((r) => r && r.urlBannerField);
        const hasNewSpeakers = results.some((r) => r && r.speakers);

        if (hasNewSpeakers) {
          setSelectedSpeakers((prevSpeakers) =>
            prevSpeakers.map((speaker) => ({
              ...speaker,
              isExisting: true,
            }))
          );
        }

        if (hasNewImage || hasNewSpeakers) {
          const processedSlot = processLightSlot(data);
          const finalDataToSave = {
            ...data,
            eventId: savedEventId,
            slots: [processedSlot],
          };

          const imageResult = results.find((r) => r && r.urlBannerField);
          if (imageResult) {
            finalDataToSave[imageResult.urlBannerField] = imageResult.imagePath;
          }

          const speakersResult = results.find((r) => r && r.speakers);
          if (speakersResult) {
            finalDataToSave.slots[0].speakers = speakersResult.speakers;
          }

          return saveEventLight({
            apiUrl,
            token: auth.token,
            data: finalDataToSave,
          }).then(() => savedEventId);
        }
        return Promise.resolve(savedEventId);
      })
      .then((savedEventId) => {
        return deleteSpeakersMarkedForDeletion(savedEventId);
      })
      .then(() => {
        Toast.success(I18N[language]["eventSavedSuccessfully"]);
        setIsSaving(false);
      })
      .catch((e) => {
        console.error("Save error:", e);
        Toast.error(
          e.response?.data?.message || I18N[language]["errorSavingEvent"]
        );
        setIsSaving(false);
      });
  };

  const handleContinue = () => {
    if (step > 0) {
      handleSave()
        .then(() => {
          setStep((prevStep) => prevStep + 1);
        })
        .catch(() => {
          Toast.error(I18N[language]["errorSavingEvent"]);
        });
    } else {
      const validated = checkValidations();
      if (!validated) return;
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handleTabClick = (tabId) => () => {
    if (tabId < step || eventId > 0 || data.eventId > 0) {
      setStep(tabId);
    }
  };

  const pollCommandStatus = async (commandId) => {
    const maxAttempts = 60; // 60 attempts (2 minutes)
    const pollInterval = 2000; // 2 second

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const { data: command } = await fetchCommand({
        apiUrl,
        token: auth.token,
        commandId,
      });
      const commandStatus = command.status;

      if (commandStatus === "FINISHED") {
        return true;
      }
      if (commandStatus !== "RUNNING") {
        throw new Error("Command failed");
      }

      await new Promise((resolve) => {
        setTimeout(resolve, pollInterval);
      });
    }

    throw new Error("Command timeout");
  };

  const handleDeleteEvent = async () => {
    const currentEventId = data.eventId || eventId;
    if (!currentEventId) return;

    setIsDeleting(true);

    try {
      const { data } = await deleteEvent({
        apiUrl,
        token: auth.token,
        eventId: currentEventId,
      });

      if (data.deletedId) {
        Toast.success(I18N[language]["eventDeletedSuccessfully"]);
        setShowDeleteConfirm(false);
        refreshEventsData("delete");
        onClose();
      }
    } catch (error) {
      Toast.error(I18N[language]["errorDeletingEvent"]);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicateEvent = async () => {
    const currentEventId = data.eventId || eventId;
    if (!currentEventId) return;

    setIsDuplicating(true);

    try {
      const { data: commandData } = await duplicateEvent({
        apiUrl,
        token: auth.token,
        eventId: currentEventId,
        clientId,
      });
      const commandId = commandData.command.id;

      if (commandId) {
        await pollCommandStatus(commandId);
      }

      Toast.success(I18N[language]["eventDuplicatedSuccessfully"]);
      setShowDuplicateConfirm(false);
      refreshEventsData("duplicate");
      onClose();
    } catch (error) {
      console.log("Duplication error:", error);
      Toast.error(I18N[language]["errorDuplicatingEvent"]);
    } finally {
      setIsDuplicating(false);
    }
  };

  return (
    <>
      <FlashMessage />
      <Modal
        isOpen={isOpen}
        className={{
          base: `${styles.modal} ${maximize ? styles.modal_maximize : ""}`,
          afterOpen: styles.modalAfterOpen,
          beforeClose: styles.modalBeforeClose,
        }}
        overlayClassName={{
          base: styles.overlay,
          afterOpen: styles.overlayAfterOpen,
          beforeClose: styles.overlayBeforeClose,
        }}
      >
        <div className={styles.header}>
          <span className={styles.header_title}>
            {eventId > 0 || data.eventId > 0
              ? I18N[language]["manageEvent"]
              : I18N[language]["createEvent"]}
          </span>
          <div className={styles.header_actions}>
            <div className={styles.header_actions_icons}>
              <div
                className={styles.header_actions_icon}
                onClick={() => setMaximize(!maximize)}
              >
                <IconMaximize />
              </div>
              {(eventId > 0 || data.eventId > 0) && (
                <div
                  className={styles.header_actions_icon}
                  onClick={() => setShowDotsMenu(!showDotsMenu)}
                  style={{ position: "relative" }}
                >
                  <IconDots />
                  {showDotsMenu && (
                    <div className={styles.dotsMenu}>
                      <button
                        className={styles.dotsMenuItem}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDotsMenu(false);
                          setShowDuplicateConfirm(true);
                        }}
                        disabled={isDuplicating || isDeleting}
                      >
                        {isDuplicating ? (
                          <ClipLoader size={14} color="#333" />
                        ) : (
                          I18N[language]["duplicate"]
                        )}
                      </button>
                      <button
                        className={styles.dotsMenuItem}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDotsMenu(false);
                          setShowDeleteConfirm(true);
                        }}
                        disabled={isDuplicating || isDeleting}
                      >
                        {isDeleting ? (
                          <ClipLoader size={14} color="#333" />
                        ) : (
                          I18N[language]["delete"]
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div onClick={onClose} className={styles.header_close}>
              <IconCloseBlack />
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab} ${
                  step === tab.id ? styles.tab_active : ""
                }`}
                onClick={handleTabClick(tab.id)}
              >
                <span className={styles.tab_icon}>{tab.icon}</span>
                <span className={styles.tab_label}>{tab.label}</span>
              </button>
            ))}
          </div>

          {step === 0 && (
            <Editor
              language={language}
              data={data}
              setData={setData}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
              setStep={setStep}
              auth={auth}
            />
          )}
          {step === 1 && (
            <Config
              language={language}
              data={data}
              setData={setData}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
              setStep={setStep}
              tags={tags}
              env={env}
              auth={auth}
              clientId={clientId}
              selectedSpeakers={selectedSpeakers}
              setSelectedSpeakers={setSelectedSpeakers}
              setSpeakersToDelete={setSpeakersToDelete}
            />
          )}
          {step === 2 && (
            <Guests
              language={language}
              data={data}
              env={env}
              auth={auth}
              eventId={eventId || data.eventId}
            />
          )}
          {step === 3 && (
            <Tickets
              language={language}
              data={data}
              setData={setData}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
              setStep={setStep}
              labelTemplates={labelTemplates}
              env={env}
              auth={auth}
              eventId={eventId || data.eventId}
              clientId={clientId}
            />
          )}
        </div>

        <div className={styles.footer}>
          {step > 0 && (
            <button
              className={styles.footer_previousButton}
              onClick={() => setStep(step - 1)}
            >
              <IconArrowBlack />
              {I18N[language]["previous"]}
            </button>
          )}
          <div className={styles.footer_actions}>
            <button
              className={`${styles.footer_saveButton} ${
                step === 0 && !(eventId || data.eventId)
                  ? styles.footer_saveButton_disabled
                  : ""
              }`}
              disabled={(step === 0 && !(eventId || data.eventId)) || isSaving}
              onClick={handleSave}
            >
              {isSaving && <ClipLoader size={16} color="#ffffff" />}
              {I18N[language]["save"]}
            </button>
            {step < 3 && (
              <button
                className={styles.footer_nextButton}
                onClick={handleContinue}
                disabled={isSaving}
              >
                <span>
                  {step === 0
                    ? I18N[language]["configNext"]
                    : step === 1
                    ? I18N[language]["addGuests"]
                    : step === 2
                    ? I18N[language]["manageTickets"]
                    : ""}
                </span>
                {isSaving ? (
                  <ClipLoader size={16} color="#ffffff" />
                ) : (
                  <IconArrowWhite />
                )}
              </button>
            )}
          </div>
        </div>
      </Modal>

      <ModalConfirm
        type="delete"
        isOpen={showDeleteConfirm}
        onCancel={() => !isDeleting && setShowDeleteConfirm(false)}
        onConfirm={handleDeleteEvent}
        inProcess={isDeleting}
        title={I18N[language]["confirmDelete"]}
        text={I18N[language]["confirmDeleteMessage"]}
        labelNo={I18N[language]["cancel"]}
        labelYes={I18N[language]["delete"]}
      />

      <ModalConfirm
        type="duplicate"
        isOpen={showDuplicateConfirm}
        onCancel={() => !isDuplicating && setShowDuplicateConfirm(false)}
        onConfirm={handleDuplicateEvent}
        inProcess={isDuplicating}
        title={I18N[language]["confirmDuplicate"]}
        text={I18N[language]["confirmDuplicateMessage"]}
        labelNo={I18N[language]["cancel"]}
        labelYes={I18N[language]["duplicate"]}
      />
    </>
  );
};
