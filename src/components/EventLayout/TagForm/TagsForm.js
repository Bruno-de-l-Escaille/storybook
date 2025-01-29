import cn from "classnames";
import React, { useEffect, useState } from "react";
import { fetchTags, getEventWithTag, updateEventTags } from "../../../api";
import { getApiUrl, getByLanguage } from "../../../utils";
import styles from "./TagsForm.module.scss";
import TagsSelect from "react-select/async";
import IconCross from "../../CycleCard/assets/IconCross";
import { ClipLoader } from "react-spinners";
import Tag from "../Tag/Tag";
import { I18N } from "../../../i18n";

function TagsForm({ setShowAddTags, eventId, language, token, env }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [eventWithTag, setEventWithTag] = useState(null);
  const [eventTags, setEventTags] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletedTagId, setDeletedTagId] = useState(0);
  const [inputTag, setInputTag] = useState("");
  const [isEventWithTagFetching, setIsEventWithTagFetching] = useState(false);
  const apiUrl = getApiUrl(env);

  useEffect(() => {
    const fetchEventWithTag = async () => {
      setIsEventWithTagFetching(true);
      const {
        data: { data },
      } = await getEventWithTag({ apiUrl, token, eventId });
      setEventWithTag(data[0]);
      setIsEventWithTagFetching(false);
    };
    fetchEventWithTag();
  }, [env, eventId, token]);

  const handleEventTagsAndOptionsChange = (evtTags, updatedTags) => {
    if (eventTags) {
      setEventTags(evtTags);
    }
    if (updatedTags) {
      setSelectedOptions(updatedTags);
    }
  };

  useEffect(() => {
    if (
      !isEventWithTagFetching &&
      eventWithTag &&
      eventWithTag.id === eventId
    ) {
      setEventTags(eventWithTag.tag ?? []);
      setFetching(false);
      setSaving(false);
    }
  }, [isEventWithTagFetching, eventWithTag]);

  const mapTags = (tags) => {
    const normalTags = [];
    const superTags = [];

    tags.forEach((item) => {
      const nameLlabel = item?.isSuperTag
        ? `⚡︎ ${getByLanguage(item, "name", language)}`
        : getByLanguage(item, "name", language);
      if (item.isSuperTag) {
        superTags.push({
          value: item.id,
          label: nameLlabel,
        });
      } else {
        normalTags.push({
          value: item.id,
          label: nameLlabel,
        });
      }
    });

    if (superTags.length > 0 && normalTags.length > 0) {
      return [
        {
          label: "Super Tags",
          options: superTags,
        },
        {
          label: "Tags",
          options: normalTags,
        },
      ];
    }
    if (superTags.length > 0) {
      return superTags;
    }
    return normalTags;
  };

  const loadOptions = async (inputValue) => {
    const {
      data: { data: searchTags },
    } = await fetchTags({
      apiUrl,
      token,
      inputTag: inputValue.trim(),
      language,
    });
    const filtredTags = searchTags.filter(
      (item1) => !eventTags.some((item2) => item1.id === item2.id)
    );
    return mapTags(filtredTags);
  };

  const handleTagSelectionChange = (value) => {
    if (value) {
      setSelectedOptions(value);
    } else {
      setSelectedOptions([]);
    }
  };

  const mapOptions = (selectOptions) => {
    const mappedOptions = selectOptions.map((item) => ({
      id: item.value,
    }));
    return mappedOptions;
  };

  const saveTags = () => {
    if (selectedOptions.length) {
      setSaving(true);
      const filtredTags = mapOptions(selectedOptions).filter(
        (item1) => !eventTags.some((item2) => item1.id === item2.id)
      );
      updateEventTags({
        apiUrl,
        token,
        eventId,
        updatedEventTags: [...filtredTags, ...eventTags],
      }).then((result) => {
        setEventTags(result.data.data.tag ?? []);
        setFetching(false);
        setSaving(false);
      });
      setSelectedOptions([]);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputTag.trim() === "") {
      saveTags();
    }
  };

  useEffect(() => {
    if (deletedTagId) {
      setSaving(true);
      const updatedEventTags = eventTags.filter(
        (item) => item.id !== deletedTagId
      );
      updateEventTags({ apiUrl, token, eventId, updatedEventTags }).then(
        (result) => {
          setEventTags(result.data.data.tag ?? []);
          setFetching(false);
          setSaving(false);
        }
      );
    }
    setDeletedTagId(0);
  }, [deletedTagId]);

  const selectStyle = {
    placeholder: (base) => ({
      ...base,
      fontSize: "13.8px",
      fontWeight: 400,
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: "#F8F9FA",
    }),
  };

  return (
    <div className={styles.TagsForm}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>{I18N[language]["keywords"]}</div>
        <div className={styles.i}>
          <div
            className={cn(styles.close_icon, "col small-1")}
            onClick={() => setShowAddTags(false)}
          >
            <IconCross width="12" height="12" fill="#6D7F92" />
          </div>
        </div>
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.tagAndSelectContainer}>
          <div className={styles.selectContainer}>
            <TagsSelect
              isMulti
              className={styles.tagsSelectContainer}
              classNamePrefix={styles.tagsSelect}
              loadOptions={loadOptions}
              onChange={handleTagSelectionChange}
              onInputChange={(inputValue) => setInputTag(inputValue)}
              onKeyDown={handleKeyDown}
              value={selectedOptions}
              defaultOptions
              loadingMessage={() => "Loading ..."}
              noOptionsMessage={() => I18N[language]["noOptions"]}
              placeholder={I18N[language]["selectKeywords"]}
              styles={selectStyle}
              maxMenuHeight={187.5}
            />
          </div>
          {selectedOptions.length > 0 && (
            <div className={cn(styles.action)}>
              <button
                type="submit"
                className={cn(styles.submitBtn)}
                onClick={saveTags}
              >
                {I18N[language]["save"]}
              </button>
            </div>
          )}

          {!fetching && (
            <div className={styles.tagsContainer}>
              {eventTags.map((item) => (
                <Tag
                  key={item.id}
                  tag={item}
                  action={handleEventTagsAndOptionsChange}
                  tags={eventTags}
                  setDeletedTagId={setDeletedTagId}
                  language={language}
                  token={token}
                  apiUrl={apiUrl}
                  env={env}
                />
              ))}
            </div>
          )}
          {fetching && (
            <div className={styles.loader}>
              <ClipLoader size="30px" color="#18a0fb" />
            </div>
          )}
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

export default TagsForm;
