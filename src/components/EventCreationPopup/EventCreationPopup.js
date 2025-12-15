import React, { useState } from "react";
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
import { isEmpty } from "../../utils";

export const EventCreationPopup = (props) => {
  const { isOpen, language } = props;
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState({
    nameFr: "",
    nameNl: "",
    nameEn: "",
    descriptionFr: "",
    descriptionNl: "",
    descriptionEn: "",
    image: "",
    startDateTime: "",
    endDateTime: "",
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
  });
  console.log("EventCreationPopup data:", data);
  const [validationErrors, setValidationErrors] = useState({
    titleError: false,
    dateError: false,
    startTimeError: false,
    endTimeError: false,
    timeComparisonError: false,
    addressError: false,
    maxPlacesError: false,
  });

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

  const handleContinue = () => {
    if (activeTab === 0) {
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
        return;
      }
    } else if (activeTab === 1) {
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
        return;
      }
    }

    setActiveTab((prevTab) => prevTab + 1);
  };

  return (
    <Modal isOpen={isOpen} className={styles.modal}>
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
                activeTab === tab.id ? styles.tab_active : ""
              }`}
            >
              <span className={styles.tab_icon}>{tab.icon}</span>
              <span className={styles.tab_label}>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 0 && (
          <Editor
            language={language}
            data={data}
            setData={setData}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 1 && (
          <Config
            language={language}
            data={data}
            setData={setData}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 2 && (
          <Guests
            language={language}
            data={data}
            setData={setData}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 3 && (
          <Tickets
            language={language}
            data={data}
            setData={setData}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
            setActiveTab={setActiveTab}
          />
        )}
      </div>

      <div className={styles.footer}>
        <button className={styles.footer_saveButton}>
          {I18N[language]["save"]}
        </button>
        <button className={styles.footer_nextButton} onClick={handleContinue}>
          <span>Passer a la configuration</span>
          <IconArrowWhite />
        </button>
      </div>
    </Modal>
  );
};
