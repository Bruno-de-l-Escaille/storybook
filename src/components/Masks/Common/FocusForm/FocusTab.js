import React from "react";
import styles from "./FocusForm.module.scss";
import { capitalizeFirstLetter } from "../../../../utils";
import { I18N } from "../../../../i18n";
import { ClipLoader } from "react-spinners";
import moment from "moment";

const FocusTab = ({
  positionOptions,
  selectedFocusConfig,
  selectedOption,
  handleChange,
  handleDateChange,
  handleSave,
  saving,
  language,
  eventId,
  cycleId,
  MomentDatePicker,
}) => {
  return (
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
  );
};

export default FocusTab;
