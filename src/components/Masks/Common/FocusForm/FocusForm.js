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
import { DatePicker } from "antd";
import momentGenerateConfig from "rc-picker/lib/generate/moment";

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
  const apiUrl = getApiUrl(env);
  const [selectedFocusConfig, setSelectedFocusConfig] = useState(
    focusConfig || defaultFocusConfig
  );
  const [saving, setSaving] = useState(false);

  const positionOptions = [
    { value: 1, label: I18N[language]["inFirst"] },
    { value: 2, label: I18N[language]["inSecond"] },
    { value: 3, label: I18N[language]["inThird"] },
    { value: 4, label: I18N[language]["inFourth"] },
    { value: 0, label: I18N[language]["noOptions"] },
  ];

  const currentPosition =
    selectedFocusConfig?.[`position${capitalizeFirstLetter(language)}`] ?? 0;
  const selectedOption = positionOptions.find(
    (opt) => opt.value === currentPosition
  );

  const handleChange = (field, value) => {
    setSelectedFocusConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (value) => {
    const lang = capitalizeFirstLetter(language);

    const formattedDate = value ? value : "";
    setSelectedFocusConfig((prev) => ({
      ...prev,
      [`displayDate${lang}`]: formattedDate,
    }));
  };

  const handleSave = async () => {
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

    if (eventId) {
      updateEventFocusConfig({
        apiUrl,
        token,
        eventId,
        updatedFocusConfig: updatedFocusConfig,
      }).then(({ data }) => {
        const updatedEvent = data.data;
        setSaving(false);
        setShowFocusConfig(false);
        updateFocusConfig(updatedEvent.focusConfig);
      });
    } else if (cycleId) {
      updateCycleFocusConfig({
        apiUrl,
        token,
        cycleId,
        updatedFocusConfig: updatedFocusConfig,
      }).then(({ data }) => {
        const updatedCycle = data.data;
        setSaving(false);
        setShowFocusConfig(false);
        updateFocusConfig(updatedCycle.focusConfig);
      });
    }
  };

  useEffect(() => {
    if (
      isEmpty(
        selectedFocusConfig[`displayDate${capitalizeFirstLetter(language)}`]
      )
    ) {
      const defaultDisplayDate = moment(endDateTime).isAfter(moment())
        ? moment(endDateTime).endOf("day").format("YYYY-MM-DD HH:mm:ss")
        : moment().add(1, "month").endOf("day").format("YYYY-MM-DD HH:mm:ss");

      handleDateChange(defaultDisplayDate);
    }
  }, [language]);

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
                    }-${eventId || cycleId}`}
                    name={`option-${eventId || cycleId}`}
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
                    }}
                    className={styles.radioInput}
                  />
                  <label
                    htmlFor={`position${capitalizeFirstLetter(language)}-${
                      option.value
                    }-${eventId || cycleId}`}
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
                      <div className={styles.formField}>
                        <label className={styles.fieldLabel}>
                          {I18N[language]["Until"]}
                        </label>
                        <MomentDatePicker
                          value={
                            selectedFocusConfig[
                              `displayDate${capitalizeFirstLetter(language)}`
                            ]
                              ? moment(
                                  selectedFocusConfig[
                                    `displayDate${capitalizeFirstLetter(
                                      language
                                    )}`
                                  ]
                                )
                              : null
                          }
                          onChange={(date) =>
                            handleDateChange(
                              date ? date.format("YYYY-MM-DD HH:mm:ss") : null
                            )
                          }
                          format="DD/MM/YYYY HH:mm"
                          showTime={{ format: "HH:mm" }}
                          className={styles.dateInput}
                          disabledDate={(current) =>
                            current && current < moment().startOf("second")
                          }
                          placeholder={I18N[language]["Until"]}
                          showNow={false}
                          allowClear={false}
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
};
