import cn from "classnames";
import React, { useEffect, useState } from "react";
import { capitalizeFirstLetter, getApiUrl } from "../../../../utils";
import styles from "./FocusForm.module.scss";
import IconCross from "../../../CycleCard/assets/IconCross";
import { ClipLoader } from "react-spinners";
import { I18N } from "../../../../i18n";
import moment from "moment";
import {
  updateCycleFocusConfig,
  updateEventFocusConfig,
} from "../../../../api";

export function FocusForm({
  setShowFocusConfig,
  eventId,
  cycleId,
  language,
  token,
  env,
  focusConfig,
}) {
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
  const apiUrl = getApiUrl(env);
  const [selectedFocusConfig, setSelectedFocusConfig] = useState(
    focusConfig || defaultFocusConfig
  );
  const [selectedOption, setSelectedOption] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelectedFocusConfig(focusConfig || defaultFocusConfig);
    const currentPosition =
      focusConfig?.[`position${capitalizeFirstLetter(language)}`];
    if (currentPosition) {
      const option = positionOptions.find(
        (opt) => opt.value === currentPosition
      );
      if (option) {
        setSelectedOption(option);
      }
    }
  }, [focusConfig, language]);

  const positionOptions = [
    { value: 1, label: I18N[language]["inFirst"] },
    { value: 2, label: I18N[language]["inSecond"] },
    { value: 3, label: I18N[language]["inThird"] },
    { value: 4, label: I18N[language]["inFourth"] },
    { value: 0, label: I18N[language]["noOptions"] },
  ];

  const handleChange = (field, value) => {
    setSelectedFocusConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (lang, value) => {
    const formattedDate = value
      ? moment(value).format("YYYY-MM-DD HH:mm:ss")
      : "";
    handleChange(`displayDate${lang}`, formattedDate);
  };

  const handleSave = async () => {
    setSaving(true);
    if (eventId) {
      updateEventFocusConfig({
        apiUrl,
        token,
        eventId,
        updatedFocusConfig: selectedFocusConfig,
      }).then((result) => {
        setSaving(false);
      });
    } else if (cycleId) {
      updateCycleFocusConfig({
        apiUrl,
        token,
        cycleId,
        updatedFocusConfig: selectedFocusConfig,
      }).then((result) => {
        setSaving(false);
      });
    }
  };

  return (
    <div className={styles.FocusForm}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>{I18N[language]["position"]}</div>
        <div className={styles.i}>
          <div
            className={cn(styles.close_icon, "col small-1")}
            onClick={() => setShowFocusConfig(false)}
          >
            <IconCross width="12" height="12" fill="#6D7F92" />
          </div>
        </div>
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.focusContainer}>
          <div className={styles.optionsContainer}>
            {positionOptions.map((option) => (
              <div key={option.value} className={styles.optionItem}>
                <div className={styles.radioContainer}>
                  <input
                    type="radio"
                    id={`position${capitalizeFirstLetter(language)}-${
                      option.value
                    }`}
                    name="option"
                    value={option.value}
                    checked={
                      selectedFocusConfig[
                        `position${capitalizeFirstLetter(language)}`
                      ] === option.value
                    }
                    onChange={() => {
                      handleChange(
                        `position${capitalizeFirstLetter(language)}`,
                        option.value
                      );
                      setSelectedOption(option);
                    }}
                    className={styles.radioInput}
                  />
                  <label
                    htmlFor={`position${capitalizeFirstLetter(language)}-${
                      option.value
                    }`}
                    className={styles.radioLabel}
                  >
                    {capitalizeFirstLetter(option.label)}
                  </label>
                </div>

                {selectedOption &&
                  selectedOption.value === option.value &&
                  selectedOption.value !== 0 && (
                    <div className={styles.optionDetails}>
                      <div className={styles.formField}>
                        <label className={styles.fieldLabel}>Date</label>
                        <input
                          type="datetime-local"
                          value={
                            selectedFocusConfig[
                              `displayDate${capitalizeFirstLetter(language)}`
                            ]
                          }
                          onChange={(e) =>
                            handleDateChange(
                              capitalizeFirstLetter(language),
                              e.target.value
                            )
                          }
                          className={styles.dateInput}
                        />
                      </div>

                      <div className={styles.formField}>
                        <label className={styles.fieldLabel}>
                          {I18N[language]["title"]}
                        </label>
                        <input
                          type="text"
                          value={
                            selectedFocusConfig[
                              `title${capitalizeFirstLetter(language)}`
                            ] || ""
                          }
                          onChange={(e) =>
                            handleChange(
                              `title${capitalizeFirstLetter(language)}`,
                              e.target.value
                            )
                          }
                          placeholder={I18N[language]["title"]}
                          className={styles.textInput}
                        />
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
          <button className={styles.saveButton} onClick={handleSave}>
            {I18N[language]["save"]}
          </button>
        </div>
        {saving && (
          <div className={styles.saving}>
            <div className={styles.loader}>
              <ClipLoader size="30px" color="#18a0fb" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
