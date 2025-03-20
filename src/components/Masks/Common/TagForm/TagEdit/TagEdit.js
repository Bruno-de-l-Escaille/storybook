import React, { useEffect, useState } from "react";
import Select from "react-select/async";
import { ClipLoader } from "react-spinners";
import styles from "./TagEdit.module.scss";
import { getTags, saveTag } from "../../../../../api";
import { getTagName } from "../../../../../utils";
import { I18N } from "../../../../../i18n";
import IconCross from "../../../../EventLayout/assets/IconCross";
import { Toast } from "../../../../ToastContainer/ToastContainer";

export default function TagEdit({
  tag,
  tags,
  action,
  language,
  handleModalClose,
  token,
  apiUrl,
  env,
}) {
  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: "none",
      backgroundColor: state.isDisabled ? "#e6e6e6" : "#fff",
      boxShadow: "none",
      border: "none",
      borderBottom: state.isFocused ? "1px solid #2495E1" : "1px solid #CED4DB",
      "&:hover": {
        borderColor: state.isFocused ? "#18A0FB" : "#DFE2E6",
      },
      padding: 0,
    }),
    placeholder: (provided, state) => ({
      ...provided,
      fontSize: "12px",
      lineHeight: "14px",
      color: "#6D7F92",
      fontWeight: 400,
    }),
    menuList: (provided, state) => ({
      ...provided,
      paddingTop: "0",
      paddingBottom: "0",
    }),
    menu: (provided, state) => ({
      ...provided,
      borderRadius: "5px",
      backgroundColor: "#FFFFFF",
      overflow: "hidden",
    }),
    option: (provided, state) => ({
      ...provided,
      textAlign: "left",
      fontSize: "12px",
      lineHeight: "14px",
    }),
    multiValue: (provided, { data }) => ({
      ...provided,
      backgroundColor: data.color ? data.color : "#F1F2F4",
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
      fontSize: ".75rem",
      textTransform: "uppercase",
      color: "inherit",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
    }),
    singleValue: (provided, state) => ({
      ...provided,
      fontSize: "14px",
      lineHeight: "16px",
      color: "#29394D",
    }),
  };

  const [editTag, setEditTag] = useState(tag);
  const [savingTag, setSavingTag] = useState(false);
  const [superTag, setSuperTag] = useState(null);
  const [savingSuperTag, setSavingSuperTag] = useState(false);
  const nameAttr = `name${
    language.charAt(0).toUpperCase() + language.slice(1)
  }`;
  const [applyAllSelection, setApplyAllSelection] = useState(false);

  const saveTranslateTag = () => {
    setSavingTag(true);
    saveTag(token, editTag, apiUrl)
      .then(() => {
        const updatedTags = tags.map((item) => {
          if (item.id === editTag.id) {
            return {
              label: editTag[nameAttr],
              name: editTag[nameAttr],
              value: editTag.id,
              tag: editTag,
              nameFr: editTag["nameFr"],
              nameNl: editTag["nameNl"],
              nameEn: editTag["nameEn"],
              isSuperTag: editTag.isSuperTag,
              id: editTag.id,
              superTag: editTag?.superTag ?? null,
            };
          }
          return item;
        });
        if (action) {
          action(updatedTags);
        }
        setSavingTag(false);
        Toast.success("Tag ajouté avec succès");
        handleModalClose();
      })
      .catch((e) => {
        setSavingTag(false);
        Toast.error("Errors lors de l'ajout du tag");
      });
  };

  useEffect(() => {
    if (editTag?.superTag) {
      const label = getTagName(editTag.superTag, language);
      const tmp = {
        label: `⚡︎ ${label}`,
        name: editTag.superTag[nameAttr],
        value: editTag.superTag.id,
        tag: {
          id: editTag.superTag.id,
          nameEn: editTag.superTag.nameEn,
          nameFr: editTag.superTag.nameFr,
          nameNl: editTag.superTag.nameNl,
        },
      };

      setSuperTag(tmp);
    } else if (tags?.length > 0) {
      const superT = tags.filter((tag) => tag?.isSuperTag == true);
      if (superT?.length > 0) {
        setSuperTag(superT[0]);
      }
    }
  }, []);

  const fetchSuperTags = (inputValue) => {
    let customFilter = [];
    if (inputValue !== null) {
      const textFilter = inputValue.replace(/'/g, "");
      customFilter = [
        { property: "isSuperTag", value: 1, operator: "eq" },
        {
          property: nameAttr,
          value: textFilter,
          operator: "like",
        },
      ];
    }

    return getTags({
      token,
      language,
      customFilter,
      apiUrl,
    }).then((result) => {
      const tags = result.data.data;

      return tags.map((tag) => {
        const label = getTagName(tag, language);
        const tmp = {
          label: `⚡︎ ${label}`,
          name: tag[nameAttr],
          value: tag.id,
          tag: {
            id: tag.id,
            nameEn: tag.nameEn,
            nameFr: tag.nameFr,
            nameNl: tag.nameNl,
          },
        };
        return tmp;
      });
    });
  };

  const handleSaveSuperTag = async () => {
    const tagIds = [];
    if (applyAllSelection && tags) {
      tags.forEach((tag) => {
        if (!(tag.isSuperTag == 1) && !tag.superTag) {
          tagIds.push(tag.id);
        }
      });
    } else {
      tagIds.push(editTag.id);
    }
    if (!superTag) {
      Toast.error("Veuillez sélectionner un super tag");
      return null;
    }
    if (!tagIds.length) {
      Toast.error("Veuillez sélectionner un tag");
      return null;
    }

    try {
      setSavingSuperTag(true);

      let tab = [...tags];
      for (let i = 0; i < tagIds.length; i++) {
        const tagId = tagIds[i];
        await saveTag(
          token,
          {
            id: tagId,
            superTag: superTag?.tag?.id,
          },
          apiUrl,
          true
        );

        tab = tab.map((item) => {
          if (item.id === tagId) {
            return {
              label: getTagName(item, language),
              name: item[nameAttr],
              value: item.id,
              tag: {
                ...item,
                superTag: superTag.tag,
              },
              superTag: superTag.tag,
              nameFr: item["nameFr"],
              nameNl: item["nameNl"],
              nameEn: item["nameEn"],
              isSuperTag: item.isSuperTag,
              id: item.id,
            };
          }
          return item;
        });
      }
      if (action) {
        action(tab);
      }
      setSavingSuperTag(false);
      setSuperTag(null);
      Toast.success("Super Tag ajouté avec succès");
      handleModalClose();
    } catch (e) {
      setSavingSuperTag(false);
    }
  };

  return (
    <>
      <div className={styles.modal_header}>
        <span>Modifier le tag</span>
        <div className={styles.close_icon} onClick={handleModalClose}>
          <IconCross width="12" height="12" fill="#6D7F92" />
        </div>
      </div>
      {editTag && (
        <>
          <div className={styles.modalTag}>
            <div className={styles.modalTag_left}>
              <h3>Tag</h3>
              <div className={styles.formRow}>
                <label
                  className={`${styles.configLabel} ${styles.configLabelFlex}`}
                >
                  <img
                    src={`https://tamtam.s3-eu-west-1.amazonaws.com/cdn/widget/${env}/img/flags/FR.jpg`}
                    alt="flag"
                  />
                  <span>Nom Tag FR</span>
                </label>
                <input
                  className={styles.formInput}
                  value={editTag.nameFr}
                  onChange={(e) => {
                    setEditTag({ ...editTag, nameFr: e.target.value });
                  }}
                />
              </div>
              <div className={styles.formRow}>
                <label
                  className={`${styles.configLabel} ${styles.configLabelFlex}`}
                >
                  <img
                    src={`https://tamtam.s3-eu-west-1.amazonaws.com/cdn/widget/${env}/img/flags/NL.jpg`}
                    alt="flag"
                  />
                  <span>Nom Tag NL</span>
                </label>
                <input
                  className={styles.formInput}
                  value={editTag.nameNl}
                  onChange={(e) => {
                    setEditTag({ ...editTag, nameNl: e.target.value });
                  }}
                />
              </div>
              <div className={styles.formRow}>
                <label
                  className={`${styles.configLabel} ${styles.configLabelFlex}`}
                >
                  <img
                    src={`https://tamtam.s3-eu-west-1.amazonaws.com/cdn/widget/${env}/img/flags/EN.jpg`}
                    alt="flag"
                  />
                  <span>Nom Tag EN</span>
                </label>
                <input
                  className={styles.formInput}
                  value={editTag.nameEn}
                  onChange={(e) => {
                    setEditTag({ ...editTag, nameEn: e.target.value });
                  }}
                />
              </div>

              <div className={styles.modalTag_controls}>
                {savingTag ? (
                  <button className={styles.controls__ok}>
                    <ClipLoader size="30" color="#fff" />
                  </button>
                ) : (
                  <button
                    onClick={saveTranslateTag}
                    className={styles.saveButton}
                  >
                    {I18N[language]["save"]}
                  </button>
                )}
              </div>
            </div>

            <div className={styles.modalTag_right}>
              <h3>Super Tag</h3>

              {!(editTag.superTag == 1) && (
                <>
                  <div className={styles.formRow}>
                    <label className={styles.configLabel}>
                      Sélectionner un Super Tag
                    </label>
                    <Select
                      cacheOptions
                      isClearable
                      value={superTag}
                      styles={selectStyles}
                      onChange={(e) => setSuperTag(e)}
                      loadOptions={fetchSuperTags}
                      classNamePrefix="custom-select"
                    />
                  </div>

                  <div className={styles.superTag_box}>
                    {!editTag?.superTag && (
                      <>
                        <p className={styles.superTag_title}>
                          <span>Appliquer tous les tags</span>
                          <input
                            type="checkbox"
                            checked={applyAllSelection}
                            onChange={(e) => setApplyAllSelection(e)}
                          />
                        </p>

                        <p className={styles.tags_list}>
                          {tags?.map((tag) =>
                            !(tag.isSuperTag === 1) && !tag?.superTag ? (
                              <span className={styles.tag}>
                                {getTagName(tag, language)}
                              </span>
                            ) : null
                          )}
                        </p>
                      </>
                    )}
                  </div>
                </>
              )}

              <div className={styles.modalTag_controls}>
                {savingSuperTag ? (
                  <button className={styles.controls__ok}>
                    <ClipLoader size="30px" color="#fff" />
                  </button>
                ) : (
                  <button
                    onClick={handleSaveSuperTag}
                    className={styles.saveButton}
                  >
                    {I18N[language]["save"]}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className={styles.modalTag_footer}>
            <button onClick={handleModalClose} className={styles.cancelButton}>
              Annuler
            </button>
          </div>
        </>
      )}
    </>
  );
}
