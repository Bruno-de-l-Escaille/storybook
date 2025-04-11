import cn from "classnames";
import React, { useEffect, useState } from "react";
import { capitalizeFirstLetter, getApiUrl, isEmpty } from "../../../../utils";
import styles from "./FocusForm.module.scss";
import IconCross from "../../../CycleCard/assets/IconCross";
import { ClipLoader } from "react-spinners";
import { I18N } from "../../../../i18n";
import moment from "moment";
import {
  updateCycleFocusConfig,
  updateEventFocusConfig,
} from "../../../../api";
import { DatePicker, Tabs } from "antd";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import TabPane from "antd/es/tabs/TabPane";
import FocusTab from "./FocusTab";
import CarouselTab from "./CarouselTab";

const MomentDatePicker = DatePicker.generatePicker(momentGenerateConfig);

export const FocusForm = ({
  setShowFocusConfig,
  eventId,
  cycleId,
  language,
  token,
  env,
  focusConfig,
  updateFocusConfig,
  carouselConfig,
  updateCarouselConfig,
  endDateTime,
}) => {
  const defaultFocusConfig = {
    positionFr: 0,
    positionNl: 0,
    positionEn: 0,
    titleFr: "",
    titleNl: "",
    titleEn: "",
    displayDateFr: "",
    displayDateNl: "",
    displayDateEn: "",
  };
  const defaultCarousselConfig = {
    positionFr: 0,
    positionNl: 0,
    positionEn: 0,
    displayDateFr: "",
    displayDateNl: "",
    displayDateEn: "",
  };
  const apiUrl = getApiUrl(env);
  const [selectedFocusConfig, setSelectedFocusConfig] = useState(
    focusConfig || defaultFocusConfig
  );
  const [selectedCarouselConfig, setSelectedCarouselConfig] = useState(
    carouselConfig || defaultCarousselConfig
  );
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("focus");

  const positionOptions = [
    { value: 1, label: I18N[language]["inFirst"] },
    { value: 2, label: I18N[language]["inSecond"] },
    { value: 3, label: I18N[language]["inThird"] },
    { value: 4, label: I18N[language]["inFourth"] },
  ];

  const positionOptionsFocus = [
    ...positionOptions,
    { value: 0, label: I18N[language]["noOptions"] },
  ];
  const positionOptionsCarousel = [
    ...positionOptions,
    { value: 5, label: I18N[language]["inFifth"] },
    { value: 0, label: I18N[language]["noOptions"] },
  ];

  const currentPositionFocus =
    selectedFocusConfig?.[`position${capitalizeFirstLetter(language)}`] ?? 0;
  const currentPositionCarousel =
    selectedCarouselConfig?.[`position${capitalizeFirstLetter(language)}`] ?? 0;

  const selectedOption = positionOptionsFocus.find(
    (opt) => opt.value === currentPositionFocus
  );
  const selectedCarouselOption = positionOptionsCarousel.find(
    (opt) => opt.value === currentPositionCarousel
  );

  const handleDateChange = (value) => {
    const lang = capitalizeFirstLetter(language);

    const formattedDate = value ? value : "";
    if (activeTab === "focus") {
      setSelectedFocusConfig((prev) => ({
        ...prev,
        [`displayDate${lang}`]: formattedDate,
      }));
    } else {
      setSelectedCarouselConfig((prev) => ({
        ...prev,
        [`displayDate${lang}`]: formattedDate,
      }));
    }
  };

  const handleSave = async (tab) => {
    setSaving(true);

    const updatedFocusConfig = {
      ...selectedFocusConfig,
      displayDateFr: selectedFocusConfig.displayDateFr
        ? moment(selectedFocusConfig.displayDateFr)
            .utc()
            .format("YYYY-MM-DD HH:mm:ss")
        : "",
      displayDateNl: selectedFocusConfig.displayDateNl
        ? moment(selectedFocusConfig.displayDateNl)
            .utc()
            .format("YYYY-MM-DD HH:mm:ss")
        : "",
      displayDateEn: selectedFocusConfig.displayDateEn
        ? moment(selectedFocusConfig.displayDateEn)
            .utc()
            .format("YYYY-MM-DD HH:mm:ss")
        : "",
    };

    const updatedCarouselConfig = {
      ...selectedCarouselConfig,
      displayDateFr: selectedCarouselConfig.displayDateFr
        ? moment(selectedCarouselConfig.displayDateFr)
            .utc()
            .format("YYYY-MM-DD HH:mm:ss")
        : "",
      displayDateNl: selectedCarouselConfig.displayDateNl
        ? moment(selectedCarouselConfig.displayDateNl)
            .utc()
            .format("YYYY-MM-DD HH:mm:ss")
        : "",
      displayDateEn: selectedCarouselConfig.displayDateEn
        ? moment(selectedCarouselConfig.displayDateEn)
            .utc()
            .format("YYYY-MM-DD HH:mm:ss")
        : "",
    };

    if (eventId) {
      updateEventFocusConfig({
        apiUrl,
        token,
        eventId,
        updatedFocusConfig: updatedFocusConfig,
        updatedCarouselConfig: updatedCarouselConfig,
      }).then(({ data }) => {
        const updatedEvent = data.data;
        setSaving(false);
        setShowFocusConfig(false);
        updateFocusConfig(updatedEvent.focusConfig);
        updateCarouselConfig(updatedEvent.carouselConfig);
      });
    } else if (cycleId) {
      updateCycleFocusConfig({
        apiUrl,
        token,
        cycleId,
        updatedFocusConfig: updatedFocusConfig,
        updatedCarouselConfig: updatedCarouselConfig,
      }).then(({ data }) => {
        const updatedCycle = data.data;
        setSaving(false);
        setShowFocusConfig(false);
        updateFocusConfig(updatedCycle.focusConfig);
        updateCarouselConfig(updatedCycle.carouselConfig);
      });
    }
  };

  useEffect(() => {
    const langKey = `displayDate${capitalizeFirstLetter(language)}`;
    const selectedConfig =
      activeTab === "focus" ? selectedFocusConfig : selectedCarouselConfig;

    if (isEmpty(selectedConfig[langKey])) {
      const defaultDisplayDate = moment(endDateTime).isAfter(moment())
        ? moment(endDateTime).endOf("day").format("YYYY-MM-DD HH:mm:ss")
        : moment().add(1, "month").endOf("day").format("YYYY-MM-DD HH:mm:ss");

      handleDateChange(defaultDisplayDate);
    } else {
      const displayDate = moment
        .utc(selectedConfig[langKey])
        .local()
        .format("YYYY-MM-DD HH:mm:ss");

      handleDateChange(displayDate);
    }
  }, [language, activeTab]);

  return (
    <div className={styles.FocusForm}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>{I18N[language][activeTab]}</div>
        <div className={styles.i}>
          <div
            className={cn(styles.close_icon, "col small-1")}
            onClick={() => setShowFocusConfig(false)}
          >
            <IconCross width="12" height="12" fill="#6D7F92" />
          </div>
        </div>
      </div>
      <Tabs defaultActiveKey="focus" onChange={(key) => setActiveTab(key)}>
        <TabPane tab="Focus" key="focus">
          <FocusTab
            positionOptions={positionOptionsFocus}
            selectedFocusConfig={selectedFocusConfig}
            selectedOption={selectedOption}
            handleChange={(field, value) => {
              setSelectedFocusConfig((prev) => ({
                ...prev,
                [field]: value,
              }));
            }}
            handleDateChange={handleDateChange}
            handleSave={handleSave}
            saving={saving}
            language={language}
            eventId={eventId}
            cycleId={cycleId}
            MomentDatePicker={MomentDatePicker}
          />
        </TabPane>
        <TabPane tab="Carousel" key="carousel">
          <CarouselTab
            positionOptions={positionOptionsCarousel}
            selectedCarouselConfig={selectedCarouselConfig}
            selectedCarouselOption={selectedCarouselOption}
            handleChange={(field, value) => {
              setSelectedCarouselConfig((prev) => ({
                ...prev,
                [field]: value,
              }));
            }}
            handleDateChange={handleDateChange}
            handleSave={handleSave}
            saving={saving}
            language={language}
            eventId={eventId}
            cycleId={cycleId}
            MomentDatePicker={MomentDatePicker}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};
