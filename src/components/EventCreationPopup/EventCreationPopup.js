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
import { getEvent, saveEventLight, uploadMedia } from "../../api";
import { Toast, FlashMessage } from "../ToastContainer/ToastContainer";
import { ClipLoader } from "react-spinners";

export const EventCreationPopup = (props) => {
  const { isOpen, language, env, auth, clientId, eventId } = props;
  const [step, setStep] = useState(0);
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
    keywords: "",
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
  });

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
  const [isProcessing, setIsProcessing] = useState(false);
  const apiUrl = getApiUrl(env);
  const s3FolderUrl = `http://s3.tamtam.pro/${
    env === "v2" ? "production" : env
  }`;

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
      });
    }
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

  const handleContinue = () => {
    const validated = checkValidations();
    if (!validated) return;

    if (step === 1) {
      setIsProcessing(true);

      saveEventLight({ apiUrl, token: auth.token, data })
        .then((resp) => {
          const savedEventId = data.eventId || resp.data.data.id;

          if (!data.eventId) {
            setData((prevData) => ({
              ...prevData,
              eventId: savedEventId,
            }));
          }

          if (data.imageFile) {
            return uploadImage(savedEventId).then(() => {
              Toast.success(I18N[language]["eventSavedSuccessfully"]);
              setIsProcessing(false);
              setStep((prevStep) => prevStep + 1);
            });
          } else {
            Toast.success(I18N[language]["eventSavedSuccessfully"]);
            setIsProcessing(false);
            setStep((prevStep) => prevStep + 1);
          }
        })
        .catch((e) => {
          Toast.error(
            e.response?.data?.message || I18N[language]["errorSavingEvent"]
          );
          setIsProcessing(false);
        });
    }

    if (!isProcessing) {
      setStep((prevStep) => prevStep + 1);
    }
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

        return saveEventLight({
          apiUrl,
          token: auth.token,
          data: { ...data, eventId, [urlBannerField]: imagePath },
        });
      })
      .catch((e) => {
        Toast.error(I18N[language]["errorUploadingImage"]);
        throw e;
      });
  };

  const handleSave = () => {
    const validated = checkValidations();
    if (!validated) return;

    setIsSaving(true);

    saveEventLight({ apiUrl, token: auth.token, data })
      .then((resp) => {
        const savedEventId = data.eventId || resp.data.data.id;

        if (!data.eventId) {
          setData((prevData) => ({
            ...prevData,
            eventId: savedEventId,
          }));
        }

        if (data.imageFile) {
          return uploadImage(savedEventId).then(() => {
            Toast.success(I18N[language]["eventSavedSuccessfully"]);
            setIsSaving(false);
          });
        } else {
          Toast.success(I18N[language]["eventSavedSuccessfully"]);
          setIsSaving(false);
        }
      })
      .catch((e) => {
        Toast.error(
          e.response?.data?.message || I18N[language]["errorSavingEvent"]
        );
        setIsSaving(false);
      });
  };

  return (
    <Modal isOpen={isOpen} className={styles.modal}>
      <FlashMessage />
      <div className={styles.header}>
        <span className={styles.header_title}>
          {I18N[language]["createEvent"]}
        </span>
        <div className={styles.header_actions}>
          <div className={styles.header_actions_icons}>
            <div className={styles.header_actions_icon}>
              <IconMaximize />
            </div>
            <div className={styles.header_actions_icon}>
              <IconDots />
            </div>
          </div>
          <IconCloseBlack />
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
          />
        )}
        {step === 2 && (
          <Guests
            language={language}
            data={data}
            setData={setData}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
            setStep={setStep}
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
              step === 0 ? styles.footer_saveButton_disabled : ""
            }`}
            disabled={step === 0 || isSaving || isProcessing}
            onClick={handleSave}
          >
            {isSaving && <ClipLoader size={16} color="#ffffff" />}
            {I18N[language]["save"]}
          </button>
          {step < 3 && (
            <button
              className={styles.footer_nextButton}
              onClick={handleContinue}
              disabled={isProcessing || isSaving}
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
              {isProcessing ? (
                <ClipLoader size={16} color="#ffffff" />
              ) : (
                <IconArrowWhite />
              )}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
