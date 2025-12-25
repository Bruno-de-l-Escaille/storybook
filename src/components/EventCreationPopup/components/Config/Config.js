import React, { useState, useEffect, useRef } from "react";
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
import { getApiUrl, isEmpty } from "../../../../utils";
import { searchSpeakers } from "../../../../api";
import IconPlus from "../../../Icons/IconPlus";
import IconCloseV2 from "../../../Icons/IconCloseV2";

const MomentDatePicker = DatePicker.generatePicker(momentGenerateConfig);

export const Config = (props) => {
  const {
    language,
    data,
    setData,
    validationErrors,
    setValidationErrors,
    tags,
    env,
    auth,
    clientId,
    setSpeakersToDelete,
    selectedSpeakers,
    setSelectedSpeakers,
  } = props;
  const [selectedTags, setSelectedTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const [speakers, setSpeakers] = useState([]);
  const [speakerInputValue, setSpeakerInputValue] = useState("");
  const [showSpeakerDropdown, setShowSpeakerDropdown] = useState(false);
  const [showSpeakerInput, setShowSpeakerInput] = useState(false);
  const speakerDropdownRef = useRef(null);
  const speakerInputRef = useRef(null);
  const apiUrl = getApiUrl(env);

  useEffect(() => {
    if (!isEmpty(data.tag)) {
      setSelectedTags(data.tag);
    }
  }, [data.tag, tags]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
      if (
        speakerDropdownRef.current &&
        !speakerDropdownRef.current.contains(e.target) &&
        speakerInputRef.current &&
        !speakerInputRef.current.contains(e.target)
      ) {
        setShowSpeakerDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (speakerInputValue.trim().length > 0) {
      searchSpeakers({
        apiUrl,
        token: auth.token,
        searchValue: speakerInputValue,
        organizationId: clientId,
      })
        .then((resp) => {
          setSpeakers(resp.data.data?.Authors || []);
          setShowSpeakerDropdown(true);
        })
        .catch((err) => {
          setSpeakers([]);
          setShowSpeakerDropdown(false);
        });
    } else {
      setSpeakers([]);
      setShowSpeakerDropdown(false);
    }
  }, [speakerInputValue, auth, env, clientId]);

  const handleDateChange = (date) => {
    const dateStr = date ? date.format("YYYY-MM-DD") : "";

    setData((prevData) => {
      const updates = { eventDate: dateStr };

      if (prevData.startTime && dateStr) {
        updates.startDateTime = `${dateStr}T${prevData.startTime}:00`;
      }

      if (prevData.endTime && dateStr) {
        updates.endDateTime = `${dateStr}T${prevData.endTime}:00`;
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
        updates.startDateTime = `${prevData.eventDate}T${timeStr}:00`;
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
        updates.endDateTime = `${prevData.eventDate}T${timeStr}:00`;
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

  const handleTagInput = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowDropdown(value.trim().length > 0);
  };

  const handleSelectTag = (tag) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      const newSelected = [...selectedTags, tag];
      setSelectedTags(newSelected);
      setData((prev) => ({
        ...prev,
        tag: newSelected.map((t) => ({
          id: t.id,
          nameFr: t.nameFr,
          nameNl: t.nameNl,
          nameEn: t.nameEn,
        })),
      }));
    }
    setInputValue("");
    setShowDropdown(false);
  };

  const handleRemoveTag = (tagId) => {
    const newSelected = selectedTags.filter((t) => t.id !== tagId);
    setSelectedTags(newSelected);
    setData((prev) => ({
      ...prev,
      tag: newSelected.map((t) => ({
        id: t.id,
        nameFr: t.nameFr,
        nameNl: t.nameNl,
        nameEn: t.nameEn,
      })),
    }));
  };

  const getTagName = (tag) => {
    const field = `name${language.charAt(0).toUpperCase() + language.slice(1)}`;
    return tag[field] || tag.nameFr || tag.nameEn || tag.nameNl || "";
  };

  const filteredTags = tags.filter((tag) => {
    if (!inputValue.trim()) return false;
    if (selectedTags.find((t) => t.id === tag.id)) return false;
    const tagName = getTagName(tag).toLowerCase();
    return tagName.includes(inputValue.toLowerCase());
  });

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

  const handleSpeakerInput = (e) => {
    const value = e.target.value;
    setSpeakerInputValue(value);
  };

  const handleSelectSpeaker = (speaker) => {
    if (!selectedSpeakers.find((s) => s.id === speaker.id)) {
      const newSelected = [
        ...selectedSpeakers,
        { ...speaker, isExisting: false },
      ];
      setSelectedSpeakers(newSelected);
    }
    setSpeakerInputValue("");
    setShowSpeakerDropdown(false);
  };

  const handleRemoveSpeaker = (speakerId) => {
    const speakerToRemove = selectedSpeakers.find((s) => s.id === speakerId);
    if (speakerToRemove?.isExisting) {
      setSpeakersToDelete((prev) => [...prev, speakerToRemove]);
    }
    const newSelected = selectedSpeakers.filter((s) => s.id !== speakerId);
    setSelectedSpeakers(newSelected);
  };

  const handleShowSpeakerInput = () => {
    setShowSpeakerInput(!showSpeakerInput);
  };

  return (
    <div className={styles.config}>
      <div className={styles.config_content}>
        <div className={styles.config_section_left}>
          <label className={styles.config_label}>
            {I18N[language]["speakers"]}
          </label>
          <div className={styles.config_speakers}>
            <div className={styles.config_speakerList}>
              {selectedSpeakers.map((speaker) => (
                <div key={speaker.id} className={styles.config_speakerCard}>
                  <img
                    src={speaker.user?.avatar || "/default-avatar.png"}
                    alt={`${speaker.user?.firstName || ""} ${
                      speaker.user?.lastName || ""
                    }`}
                    className={styles.config_speakerCard_avatar}
                  />
                  <div className={styles.config_speakerCard_name}>
                    {speaker.user?.firstName} {speaker.user?.lastName}
                  </div>
                  <hr className={styles.config_speakerCard_separator} />
                  {speaker?.[
                    `headline${
                      language.charAt(0).toUpperCase() + language.slice(1)
                    }`
                  ]?.title && (
                    <div className={styles.config_speakerCard_role}>
                      {
                        speaker[
                          `headline${
                            language.charAt(0).toUpperCase() + language.slice(1)
                          }`
                        ]?.title
                      }
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveSpeaker(speaker.id)}
                    className={styles.config_speakerCard_remove}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M6 6L14 14M6 14L14 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.config_speakerAddContainer}>
              <div
                className={styles.config_speakersAdd}
                onClick={handleShowSpeakerInput}
              >
                {!showSpeakerInput ? <IconPlus /> : <IconCloseV2 />}
              </div>
            </div>
            {showSpeakerInput && (
              <div className={styles.config_speakerSearch}>
                <input
                  ref={speakerInputRef}
                  type="text"
                  placeholder={I18N[language]["typeSpeakerName"]}
                  value={speakerInputValue}
                  onChange={handleSpeakerInput}
                  className={styles.config_input}
                />
                {showSpeakerDropdown && speakers.length > 0 && (
                  <div
                    ref={speakerDropdownRef}
                    className={styles.config_speakerDropdown}
                  >
                    <div className={styles.config_speakerDropdown_header}>
                      {I18N[language]["speakers"]}
                    </div>
                    {speakers.map((speaker) => (
                      <div
                        key={speaker.id}
                        onClick={() => handleSelectSpeaker(speaker)}
                        className={styles.config_speakerDropdownItem}
                      >
                        <img
                          src={speaker.user?.avatar || "/default-avatar.png"}
                          alt={
                            speaker.user?.firstName +
                            " " +
                            speaker.user?.lastName
                          }
                          className={styles.config_speakerDropdownItem_avatar}
                        />
                        <div className={styles.config_speakerDropdownItem_info}>
                          <div
                            className={styles.config_speakerDropdownItem_name}
                          >
                            {speaker.user?.firstName} {speaker.user?.lastName}
                          </div>
                          {speaker[
                            `headline${
                              language.charAt(0).toUpperCase() +
                              language.slice(1)
                            }`
                          ]?.title && (
                            <div
                              className={styles.config_speakerDropdownItem_role}
                            >
                              {
                                speaker[
                                  `headline${
                                    language.charAt(0).toUpperCase() +
                                    language.slice(1)
                                  }`
                                ]?.title
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
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
                    data.eventDate ? moment(data.eventDate, "YYYY-MM-DD") : null
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
                className={`${styles.config_input} ${
                  validationErrors.addressError ? styles.config_input_error : ""
                }`}
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
                  className={`${styles.config_input} ${
                    validationErrors.maxPlacesError
                      ? styles.config_input_error
                      : ""
                  }`}
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
              <div className={styles.config_tagContainer}>
                <div className={styles.config_tagInputWrapper}>
                  {selectedTags.map((tag) => (
                    <span key={tag.id} className={styles.config_tagBubble}>
                      {getTagName(tag)}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag.id)}
                        className={styles.config_tagBubble_close}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M9 3L3 9M3 3L9 9"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={I18N[language]["addKeywords"]}
                    value={inputValue}
                    onChange={handleTagInput}
                    className={styles.config_tagInput}
                  />
                </div>
                {showDropdown && filteredTags.length > 0 && (
                  <div ref={dropdownRef} className={styles.config_tagDropdown}>
                    {filteredTags.map((tag) => (
                      <div
                        key={tag.id}
                        onClick={() => handleSelectTag(tag)}
                        className={styles.config_tagDropdownItem}
                      >
                        {getTagName(tag)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
