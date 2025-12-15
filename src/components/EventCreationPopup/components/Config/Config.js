import React from "react";
import styles from "./Config.module.scss";
import { I18N } from "../../../../i18n";
import IconCalendarV3 from "../../../Icons/IconCalendarV3";
import IconClock from "../../../Icons/IconClock";
import IconLocation from "../../../Icons/IconLocation";
import IconPerson from "../../../Icons/IconPerson";
import IconMail from "../../../Icons/IconMail";
import IconPhone from "../../../Icons/IconPhone";
import { StatusSelect } from "../StatusSelect";
import { DatePicker } from "antd";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import moment from "moment";

const MomentDatePicker = DatePicker.generatePicker(momentGenerateConfig);

export const Config = (props) => {
  const {
    language,
    data,
    setData,
    validationErrors,
    setValidationErrors,
  } = props;

  const handleDateChange = (date) => {
    const dateStr = date ? date.format("DD/MM/YYYY") : "";

    setData((prevData) => {
      const updates = { eventDate: dateStr };

      if (prevData.startTime && dateStr) {
        updates.startDateTime = `${dateStr} ${prevData.startTime}`;
      }

      if (prevData.endTime && dateStr) {
        updates.endDateTime = `${dateStr} ${prevData.endTime}`;
      }

      return { ...prevData, ...updates };
    });

    if (validationErrors.dateError) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        dateError: false,
      }));
    }
  };

  const handleStartTimeChange = (e) => {
    const timeStr = e.target.value;

    setData((prevData) => {
      const updates = { startTime: timeStr };

      if (prevData.eventDate && timeStr) {
        updates.startDateTime = `${prevData.eventDate} ${timeStr}`;
      }

      return { ...prevData, ...updates };
    });

    if (
      validationErrors.startTimeError ||
      validationErrors.timeComparisonError
    ) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        startTimeError: false,
        timeComparisonError: false,
      }));
    }
  };

  const handleEndTimeChange = (e) => {
    const timeStr = e.target.value;

    setData((prevData) => {
      const updates = { endTime: timeStr };

      if (prevData.eventDate && timeStr) {
        updates.endDateTime = `${prevData.eventDate} ${timeStr}`;
      }

      return { ...prevData, ...updates };
    });

    if (validationErrors.endTimeError || validationErrors.timeComparisonError) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        endTimeError: false,
        timeComparisonError: false,
      }));
    }
  };

  const handleChangeAddress = (e) => {
    const placeField = `place${
      language.charAt(0).toUpperCase() + language.slice(1)
    }`;
    setData((prevData) => ({ ...prevData, [placeField]: e.target.value }));
    if (validationErrors.addressError) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        addressError: false,
      }));
    }
  };

  const handleChangeMaxPlaces = (e) => {
    const value = e.target.value;
    if (value === "" || parseInt(value) >= 0) {
      setData((prevData) => ({ ...prevData, maxPlaces: value }));
    }
    if (validationErrors.maxPlacesError) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        maxPlacesError: false,
      }));
    }
  };

  const handleChangeStatus = (e) => {
    setData((prevData) => ({ ...prevData, status: e.target.value }));
  };

  const handleChangeTicket = (e) => {
    const labelField = `label${
      language.charAt(0).toUpperCase() + language.slice(1)
    }`;
    setData((prevData) => ({ ...prevData, [labelField]: e.target.value }));
  };

  const handleAddKeywords = (e) => {
    setData((prevData) => ({ ...prevData, keywords: e.target.value }));
  };

  const handleContactChange = (e) => {
    const contactField = `contact${
      language.charAt(0).toUpperCase() + language.slice(1)
    }`;
    setData((prevData) => ({ ...prevData, [contactField]: e.target.value }));
  };

  const handleEmailContactChange = (e) => {
    const emailField = `emailContact${
      language.charAt(0).toUpperCase() + language.slice(1)
    }`;
    setData((prevData) => ({ ...prevData, [emailField]: e.target.value }));
  };

  const handlePhoneContactChange = (e) => {
    const phoneField = `phoneNumberContact${
      language.charAt(0).toUpperCase() + language.slice(1)
    }`;
    setData((prevData) => ({ ...prevData, [phoneField]: e.target.value }));
  };

  return (
    <div className={styles.config}>
      <div className={styles.config_content}>
        <div className={styles.config_section_left}>
          <label className={styles.config_label}>
            {I18N[language]["speakers"]}
          </label>
          <div className={styles.config_speakers}>
            <div className={styles.config_speakers_empty}>
              <button className={styles.config_speakers_addButton}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 4V16M4 10H16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className={styles.config_section_right}>
          <div className={`${styles.config_row} ${styles.dateRow}`}>
            <div className={styles.config_field}>
              <label className={styles.config_label}>
                {I18N[language]["date"]}
              </label>
              <div className={styles.config_inputWithIcon}>
                <MomentDatePicker
                  value={
                    data.eventDate ? moment(data.eventDate, "DD/MM/YYYY") : null
                  }
                  onChange={handleDateChange}
                  format="DD/MM/YYYY"
                  className={`${styles.config_input} ${
                    validationErrors.dateError ? styles.config_input_error : ""
                  }`}
                  placeholder={I18N[language]["eventDay"]}
                  suffixIcon={null}
                  allowClear={false}
                  style={{ paddingBottom: "8px" }}
                />
                <div className={styles.config_inputSeparator}></div>
                <IconCalendarV3 />
              </div>
              {validationErrors.dateError && (
                <span className={styles.config_errorMessage}>
                  {I18N[language]["dateRequired"]}
                </span>
              )}
            </div>

            <div className={styles.config_field}>
              <label className={styles.config_label}>
                {I18N[language]["from"]}
              </label>
              <div className={styles.config_inputWithIcon}>
                <input
                  type="time"
                  placeholder={I18N[language]["hourStart"]}
                  value={data.startTime || ""}
                  onChange={handleStartTimeChange}
                  className={`${styles.config_input} ${
                    validationErrors.startTimeError
                      ? styles.config_input_error
                      : ""
                  }`}
                />
                <div className={styles.config_inputSeparator}></div>
                <IconClock />
              </div>
              {validationErrors.startTimeError && (
                <span className={styles.config_errorMessage}>
                  {I18N[language]["startTimeRequired"]}
                </span>
              )}
            </div>

            <div className={styles.config_field}>
              <label className={styles.config_label}>
                {I18N[language]["to"]}
              </label>
              <div className={styles.config_inputWithIcon}>
                <input
                  type="time"
                  placeholder={I18N[language]["hourEnd"]}
                  value={data.endTime || ""}
                  onChange={handleEndTimeChange}
                  className={`${styles.config_input} ${
                    validationErrors.endTimeError ||
                    validationErrors.timeComparisonError
                      ? styles.config_input_error
                      : ""
                  }`}
                />
                <div className={styles.config_inputSeparator}></div>
                <IconClock />
              </div>
              {validationErrors.endTimeError && (
                <span className={styles.config_errorMessage}>
                  {I18N[language]["endTimeRequired"]}
                </span>
              )}
              {validationErrors.timeComparisonError && (
                <span className={styles.config_errorMessage}>
                  {I18N[language]["endTimeMustBeGreater"]}
                </span>
              )}
            </div>
          </div>

          <div className={styles.config_field}>
            <label className={styles.config_label}>
              {I18N[language]["address"]}
            </label>
            <div className={styles.config_inputWithIcon}>
              <input
                type="text"
                placeholder={I18N[language]["eventLocation"]}
                value={
                  data[
                    `place${
                      language.charAt(0).toUpperCase() + language.slice(1)
                    }`
                  ] || ""
                }
                onChange={handleChangeAddress}
                className={styles.config_input}
              />
              <div className={styles.config_inputSeparator}></div>
              <IconLocation />
            </div>
            {validationErrors.addressError && (
              <span className={styles.config_errorMessage}>
                {I18N[language]["addressRequired"]}
              </span>
            )}
          </div>

          <div className={styles.config_row}>
            <div className={styles.config_field}>
              <label className={styles.config_label}>
                {I18N[language]["maxPlaces"]}
              </label>
              <div className={styles.config_inputWithIcon}>
                <input
                  type="number"
                  placeholder="30"
                  value={data.maxPlaces || ""}
                  onChange={handleChangeMaxPlaces}
                  min="0"
                  className={styles.config_input}
                />
                <div className={styles.config_inputSeparator}></div>
                <span className={styles.config_inputLabel}>
                  {I18N[language]["guests"]}
                </span>
              </div>
              {validationErrors.maxPlacesError && (
                <span className={styles.config_errorMessage}>
                  {I18N[language]["maxPlacesRequired"]}
                </span>
              )}
            </div>

            <div className={styles.config_field}>
              <label className={styles.config_label}>
                {I18N[language]["status"]}
              </label>
              <StatusSelect
                value={data.status || "2"}
                onChange={handleChangeStatus}
                language={language}
                options={[
                  { value: "2", label: I18N[language]["inactive"] },
                  { value: "3", label: I18N[language]["soon"] },
                  { value: "1", label: I18N[language]["active"] },
                  { value: "4", label: I18N[language]["closed"] },
                ]}
              />
            </div>
          </div>

          <div className={styles.config_row}>
            <div className={styles.config_field}>
              <label className={styles.config_label}>
                {I18N[language]["ticket"]}
              </label>
              <input
                type="text"
                placeholder={I18N[language]["maxChars15"]}
                value={
                  data[
                    `label${
                      language.charAt(0).toUpperCase() + language.slice(1)
                    }`
                  ] || ""
                }
                onChange={handleChangeTicket}
                maxLength={15}
                className={styles.config_input}
              />
            </div>

            <div className={styles.config_field}>
              <label className={styles.config_label}>
                {I18N[language]["keywords"]}
              </label>
              <input
                type="text"
                placeholder={I18N[language]["addKeywords"]}
                value={data.keywords || ""}
                onChange={handleAddKeywords}
                className={styles.config_input}
              />
            </div>
          </div>

          <div className={styles.config_section}>
            <label className={styles.config_label}>
              {I18N[language]["contactPerson"]}
            </label>
            <div className={styles.config_contactFields}>
              <div className={styles.config_field}>
                <div className={styles.config_inputWithIcon}>
                  <input
                    type="text"
                    placeholder={I18N[language]["fullName"]}
                    value={
                      data[
                        `contact${
                          language.charAt(0).toUpperCase() + language.slice(1)
                        }`
                      ] || ""
                    }
                    onChange={handleContactChange}
                    className={styles.config_input}
                  />
                  <div className={styles.config_inputSeparator}></div>
                  <IconPerson />
                </div>
              </div>

              <div className={styles.config_row}>
                <div className={styles.config_field}>
                  <div className={styles.config_inputWithIcon}>
                    <input
                      type="email"
                      placeholder={I18N[language]["auth"]["email"]}
                      value={
                        data[
                          `emailContact${
                            language.charAt(0).toUpperCase() + language.slice(1)
                          }`
                        ] || ""
                      }
                      onChange={handleEmailContactChange}
                      className={styles.config_input}
                    />
                    <div className={styles.config_inputSeparator}></div>
                    <IconMail />
                  </div>
                </div>

                <div className={styles.config_field}>
                  <div className={styles.config_inputWithIcon}>
                    <input
                      type="tel"
                      placeholder={I18N[language]["phone"]}
                      value={
                        data[
                          `phoneNumberContact${
                            language.charAt(0).toUpperCase() + language.slice(1)
                          }`
                        ] || ""
                      }
                      onChange={handlePhoneContactChange}
                      className={styles.config_input}
                    />
                    <div className={styles.config_inputSeparator}></div>
                    <IconPhone />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
