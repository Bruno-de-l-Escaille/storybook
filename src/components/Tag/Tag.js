import React, { useState, useEffect } from "react";
import { components } from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { Modal as AntModal } from "antd";
import { toast } from "react-toastify";

import { getTagName } from "../../utils";
import { getTags, saveTag, saveSuperTag, getTag, getThemes } from "../../api";
import Button from "./Button";
import Loader from "./Loader";

import TagMergeModal from "./TagMergeModal";
import Switch from "./Switch";
import styles from "./Tag.module.scss";

const I18N = {
  en: {
    supertag_limit: "You have reached the limit of super tags to add",
    apply_all_tags: "Apply to all selected tags?",
    validate_select_supertag: "You must provide a super tag",
    validate_tags: "You must provide at least two tags.",
    errors: "Errors",
    validate_tag_name: "You must provide the translation of the tags",
    tag_modal_title: "Tag",
    tag_translate: "Translation",
    tag_name: "Name",
    save: "Save",
    cancel: "Cancel",
    select_supertag: "Select the linked supertag",
    merge: "Merge",
    merge_question: "Are you sure you want to merge",
    and: "and",
    keep: "Keep",
    as_principle: "as main tag",
    merge_and_delete: "Merge and delete",
    merge_selection: "Merge selection",
    name: "Name",
    usage_counter: "Usage Counter",
    theme: "Theme",
    select_theme: "Select theme ...",
    page: "Page",
    select_page: "Select a page ...",
  },
  fr: {
    supertag_limit: "Vous avez atteint la limite de super tags à ajouter",
    apply_all_tags: "Appliquer à tout les tags selectionnés?",
    validate_select_supertag: "Vous devez fournir un super tag",
    validate_tags: "Vous devez fournir au moins deux mots-clés",
    errors: "Erreurs",
    validate_tag_name: "Vous devez fournir la traduction des tags",
    tag_modal_title: "Tag",
    tag_translate: "Traduction",
    tag_name: "Nom",
    save: "Enregistrer",
    cancel: "Annuler",
    select_supertag: "Sélectionnez le supertag lié",
    merge: "Fusionner",
    merge_question: "Êtes-vous sûr de vouloir fusionner",
    and: "et",
    keep: "Garder",
    as_principle: "en tant que tag principale",
    merge_and_delete: "Fusionner et supprimer",
    merge_selection: "Fusionner la sélection",
    name: "Nom",
    usage_counter: "Compteur d'utilisation",
    theme: "Thème",
    select_theme: "Thème par défaut ...",
    page: "Page",
    select_page: "Choisir une page ...",
  },
  nl: {
    supertag_limit:
      "Je hebt de limiet van supertags bereikt die je kunt toevoegen",
    apply_all_tags: "Toepassen op alle geselecteerde tags?",
    validate_select_supertag: "Je moet een supertag opgeven",
    validate_tags: "U moet ten minste twee trefwoorden opgeven",
    errors: "fouten",
    validate_tag_name: "U moet de vertaling van de tags opgeven",
    tag_modal_title: "Tag",
    tag_translate: "Vertaling",
    tag_name: "Naam",
    save: "Opslaan",
    cancel: "Annuleren",
    select_supertag: "Selecteer de gekoppelde supertag",
    merge: "Samenvoegen",
    merge_question: "Weet je zeker dat je wilt samenvoegen",
    and: "en",
    keep: "Behouden",
    as_principle: "als hoofdtag",
    merge_and_delete: "Samenvoegen en verwijderen",
    merge_selection: "Selectie samenvoegen",
    name: "naam",
    usage_counter: "Gebruiksteller",
    theme: "Thema",
    select_theme: "Standaard thema ...",
    page: "Bladzijde",
    select_page: "Kies een pagina ...",
  },
};

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

const groupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};
const groupBadgeStyles = {
  backgroundColor: "#EBECF0",
  borderRadius: "2em",
  color: "#172B4D",
  display: "inline-block",
  fontSize: 12,
  fontWeight: "normal",
  lineHeight: "1",
  minWidth: 1,
  padding: "0.16666666666667em 0.5em",
  textAlign: "center",
};

const modalStyles = {
  content: {
    padding: "0",
  },
};

const Tag = (props) => {
  const {
    lng,
    token,
    tags,
    allowCreateTags,
    limitSuperTag,
    appEnv,
    onChange,
    apiUrl,
  } = props;

  const [openTagModal, setOpenTagModal] = useState(false);
  const [editTag, setEditTag] = useState(null);
  const [theme, setTheme] = useState(null);
  const [pages, setPages] = useState([]);
  const [pageOptions, setPageOptions] = useState([]);
  const [savingTag, setSavingTag] = useState(false);
  const [superTag, setSuperTag] = useState(null);
  const [savingSuperTag, setSavingSuperTag] = useState(false);
  const [applyAllSelection, setApplyAllSelection] = useState(false);
  const [openMergeModal, setOpenMergeModal] = useState(false);
  const [searchTags, setSearchTags] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingThemes, setLoadingThemes] = useState(false);

  const nameAttr = `name${lng.charAt(0).toUpperCase() + lng.slice(1)}`;
  const titleAttr = `title${lng.charAt(0).toUpperCase() + lng.slice(1)}`;

  useEffect(() => {
    if (openTagModal && editTag) {
      if (editTag.superTag) {
        let label = getTagName(editTag.superTag, lng);
        let tmp = {
          label: "⚡︎ " + label,
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
        const superT = tags.filter((tag) => tag.tag.isSuperTag);
        if (superT?.length > 0) {
          setSuperTag(superT[0]);
        }
      }
    }
  }, [openTagModal]);

  const fetchThemes = (inputValue) => {
    let customFilter = [];
    const lngs = ["en", "fr", "nl"].filter((itm) => itm !== lng);

    if (null !== inputValue) {
      customFilter = [
        {
          property: titleAttr,
          value: inputValue,
          operator: "like",
        },
      ];

      if (lngs) {
        lngs.forEach((itm) => {
          let lngTitleAttr = `title${
            itm.charAt(0).toUpperCase() + itm.slice(1)
          }`;
          customFilter.push({
            property: lngTitleAttr,
            value: inputValue,
            operator: "like",
            filter: "or",
          });
        });
      }
    }
    return getThemes({
      token,
      apiUrl,
      customFilter,
    }).then((result) => {
      const themeData = result.data.data;
      return themeData.map((t) => {
        return {
          title: t[titleAttr],
          id: t.id,
          pages: t.pages ? t.pages : [],
        };
      });
    });
  };

  const handleChangeTheme = (theme) => {
    setTheme(theme);
    setPages([]);

    let tab = [];
    if (theme.pages) {
      theme.pages.forEach((page) => {
        const pageTitle =
          page[titleAttr] ||
          page["titleFr"] ||
          page["titleEn"] ||
          page["titleNl"];
        tab.push({
          id: page.id,
          title: pageTitle,
        });
      });
    }
    setPageOptions(tab);
  };

  const fetchTTags = (inputValue) => {
    let customFilter = [];
    const lngs = ["en", "fr", "nl"].filter((itm) => itm !== lng);

    if (null !== inputValue) {
      let textFilter = inputValue.replace(/'/g, "");
      customFilter = [
        {
          property: nameAttr,
          value: textFilter,
          operator: "like",
        },
      ];

      if (lngs) {
        lngs.forEach((itm) => {
          let lngNameAttr = `name${itm.charAt(0).toUpperCase() + itm.slice(1)}`;
          customFilter.push({
            property: lngNameAttr,
            value: textFilter,
            operator: "eq",
            logicalOperator: "OR",
          });
        });
      }
    }
    setInputSearch(inputValue);
    const superT = tags?.filter((t) => t.tag.isSuperTag);

    return getTags({
      token,
      lng,
      customFilter,
      apiUrl,
    }).then((result) => {
      const tags = result.data.data;
      const tab = [],
        superTags = [];
      const parentTags = [];
      tags.forEach((tag) => {
        if (!tag.isSynonym) {
          parentTags.push(tag.id);
        }
      });

      tags.forEach((tag) => {
        let label = getTagName(tag, lng);
        let tmp = {
          label: tag.isSuperTag ? "⚡︎ " + label : label,
          name: tag[nameAttr],
          value: tag.id,
          tag: {
            id: tag.id,
            nameEn: tag.nameEn,
            nameFr: tag.nameFr,
            nameNl: tag.nameNl,
            counter: tag.counter,
            isSuperTag: tag.isSuperTag,
            superTag: tag.superTag ?? null,
          },
        };
        if (!tag[nameAttr] || (!tag.isSuperTag && !tag.superTag)) {
          tmp.color = "#fed493";
        }
        if (
          tag.isSynonym &&
          tag.parent !== undefined &&
          !parentTags.includes(tag.parent.id)
        ) {
          tmp.parent = { label: tag.parent[nameAttr], value: tag.parent.id };
        }

        if (!tag.isSynonym || (tag.isSynonym && tmp.parent)) {
          if (tag.isSuperTag) {
            if (!superT || superT.length < limitSuperTag) {
              superTags.push(tmp);
            }
          } else {
            tab.push(tmp);
          }
        }
      });
      if (allowCreateTags && tab.length > 3) {
        setSearchTags([...tab]);
        tab.push({
          label: "=== " + I18N[lng]["merge_selection"] + " ===",
          value: "FUSION_SELECTION_ACTION",
        });
      }
      if (superTags.length > 0 && tab.length > 0) {
        return [
          {
            label: "Super Tags",
            options: superTags,
          },
          {
            label: "Tags",
            options: tab,
          },
        ];
      } else if (superTags.length > 0) {
        return superTags;
      } else {
        return tab;
      }
    });
  };

  const fetchSuperTags = (inputValue) => {
    let customFilter = [];
    const lngs = ["en", "fr", "nl"].filter((itm) => itm !== lng);

    if (null !== inputValue) {
      let textFilter = inputValue.replace(/'/g, "");
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
      lng,
      customFilter,
      apiUrl,
    }).then((result) => {
      const tags = result.data.data;

      return tags.map((tag) => {
        let label = getTagName(tag, lng);
        let tmp = {
          label: "⚡︎ " + label,
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

  const handleChange = (e) => {
    let tmp = [];
    if (e) {
      const hasFusionAction = e.filter(
        (t) => t.value === "FUSION_SELECTION_ACTION"
      );
      if (hasFusionAction && hasFusionAction.length === 1) {
        setOpenMergeModal(true);
        return null;
      }
      let newSuperT = [];
      e.forEach((t) => {
        if (t.tag.isSuperTag) {
          newSuperT.push(t.tag.id);
        }
      });

      if (newSuperT.length > limitSuperTag) {
        toast.info(I18N[lng]["supertag_limit"]);
        return null;
      }

      let superT = [];
      tags.forEach((t) => {
        if (t.tag.isSuperTag) {
          superT.push(t.tag.id);
        }
      });

      e.forEach((tag) => {
        if (tag.parent !== undefined) {
          tmp.push({ label: tag.parent.label, value: tag.parent.value });
        } else {
          tmp.push(tag);
        }
        if (tag?.tag.superTag) {
          if (
            superT.length < limitSuperTag &&
            !newSuperT.includes(tag.tag.superTag.id) &&
            !superT.includes(tag.tag.superTag.id) &&
            tmp.filter((t) => t.tag.id === tag.tag.superTag.id).length === 0
          ) {
            let label = getTagName(tag.tag.superTag, lng);
            let tmpTag = {
              label: "⚡︎ " + label,
              name: tag[nameAttr],
              value: tag.tag.superTag.id,
              tag: { ...tag.tag.superTag, isSuperTag: true },
            };
            if (!tag.tag.superTag[nameAttr]) {
              tmpTag.color = "#fed493";
            }

            tmp.push(tmpTag);
          }
        }
      });
    }
    onChange(tmp);
  };

  const handleMultiValueClick = (e, { data }) => {
    e.stopPropagation();
    e.preventDefault();

    if (allowCreateTags) {
      setEditTag(data.tag);
      setOpenTagModal(true);
    }
  };

  const formatGroupLabel = (data) => {
    return (
      <div style={groupStyles}>
        <span>{data.label}</span>
        <span style={groupBadgeStyles}>{data.options.length}</span>
      </div>
    );
  };

  const MultiValueLabel = (props) => {
    return (
      <div
        onClick={(e) => handleMultiValueClick(e, props)}
        className={allowCreateTags && styles.tagHover}
      >
        <components.MultiValueLabel {...props} />
      </div>
    );
  };

  const handleSaveSuperTag = async () => {
    const tagIds = [];
    if (applyAllSelection && tags) {
      tags.forEach((tag) => {
        if (!tag.tag.isSuperTag && !tag.tag.superTag) {
          tagIds.push(tag.tag.id);
        }
      });
    } else {
      tagIds.push(editTag.id);
    }
    if (!superTag) {
      toast.error(I18N[lng]["validate_select_supertag"], { autoClose: true });
      return null;
    }
    if (!tagIds.length === 0) {
      toast.error(I18N[lng]["validate_tags"], { autoClose: true });
      return null;
    }

    try {
      setSavingSuperTag(true);
      let tab = [...tags];
      for (let i = 0; i < tagIds.length; i++) {
        const tagId = tagIds[i];
        await saveSuperTag(
          token,
          {
            id: tagId,
            superTag: superTag.tag.id,
          },
          apiUrl
        );

        tab = tab.map((item) => {
          if (item.value === tagId) {
            return {
              label: item.label,
              name: item.name,
              value: item.value,
              tag: {
                ...item.tag,
                superTag: superTag.tag,
              },
            };
          }
          return item;
        });
      }
      onChange(tab);
      setSavingSuperTag(false);
      setOpenTagModal(false);
      setSuperTag(null);
    } catch (e) {
      setSavingSuperTag(false);
    }
  };

  const saveTranslateTag = () => {
    let emptyTagName = false;
    if (
      editTag.nameFr.length === 0 ||
      editTag.nameNl.length === 0 ||
      editTag.nameEn.length === 0
    ) {
      emptyTagName = true;
    }
    if (emptyTagName) {
      let ErrorsContainer = () => (
        <div>
          <span>{I18N[lng]["errors"] + " :"}</span>
          <ul>
            <li>{I18N[lng]["validate_tag_name"]}</li>
          </ul>
        </div>
      );
      toast.error(<ErrorsContainer />, { autoClose: true });
      return;
    }

    setSavingTag(true);
    saveTag(token, editTag, apiUrl)
      .then(() => {
        let tab = tags.map((item) => {
          if (item.value === editTag.id) {
            return {
              label: editTag[nameAttr],
              name: editTag[nameAttr],
              value: editTag.id,
              tag: editTag,
            };
          }
          return item;
        });

        onChange(tab);
        setSavingTag(false);
        setOpenTagModal(false);
      })
      .catch((e) => {
        setSavingTag(false);
        toast.error("Error", { autoClose: true });
      });
  };

  const handleAfterMerge = () => {
    fetchTTags(inputSearch);
  };

  return (
    <>
      {/* {allowCreateTags ? (
        <AsyncCreatableSelect
          isLoading={loadingTags}
          isMulti
          cacheOptions
          value={tags}
          onChange={(e) => handleChange(e)}
          loadOptions={fetchTTags}
          createOptionPosition="first"
          styles={selectStyles}
          components={{ MultiValueLabel }}
          formatGroupLabel={formatGroupLabel}
        />
      ) : ( */}
      <AsyncSelect
        isLoading={loadingTags}
        isMulti
        cacheOptions
        isClearable
        value={tags}
        styles={selectStyles}
        onChange={(e) => handleChange(e)}
        loadOptions={fetchTTags}
        components={{ MultiValueLabel }}
        classNamePrefix="custom-select"
      />
      {/* )}  */}

      <AntModal
        closable={false}
        open={openTagModal}
        maskClosable={false}
        width="65vw"
        styles={modalStyles}
        height="45vh"
        footer={null}
        onCancel={() => {
          setOpenTagModal(false);
          setSuperTag(null);
        }}
        destroyOnClose={true}
        zIndex="9999"
      >
        <div className={styles.modal_header}>
          {I18N[lng]["tag_modal_title"]}
        </div>
        <div
          className={styles.modal_close}
          onClick={() => {
            setOpenTagModal(false);
            setSuperTag(null);
          }}
        >
          <svg width={17} height={17} viewBox="0 0 17 17" fill="none">
            <path
              d="M6.47932 8.49955L0.418184 2.43842C-0.13975 1.88049 -0.13975 0.975897 0.418184 0.418042C0.97612 -0.139892 1.88063 -0.139892 2.43856 0.418042L8.49978 6.47925L14.561 0.417963C15.1189 -0.139972 16.0234 -0.139972 16.5814 0.417963C17.1392 0.975897 17.1392 1.88049 16.5814 2.43834L10.5202 8.49947L16.5814 14.5607C17.1392 15.1186 17.1392 16.0232 16.5814 16.5811C16.0234 17.139 15.1189 17.139 14.561 16.5811L8.49978 10.5198L2.43856 16.5811C1.88071 17.139 0.97612 17.139 0.418184 16.5811C-0.13975 16.0231 -0.13975 15.1186 0.418184 14.5607L6.47932 8.49955Z"
              fill="currentColor"
            />
          </svg>
        </div>
        {editTag && (
          <>
            <div className={styles.modalTag}>
              <div className={styles.modalTag_left}>
                <h3>{I18N[lng]["tag_translate"]}</h3>
                <div className={styles.formRow}>
                  <label
                    className={`${styles.configLabel} ${styles.configLabelFlex}`}
                  >
                    <img
                      src={`https://tamtam.s3-eu-west-1.amazonaws.com/cdn/widget/${appEnv}/img/flags/FR.jpg`}
                    />
                    <span>{I18N[lng]["tag_name"]} FR</span>
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
                      src={`https://tamtam.s3-eu-west-1.amazonaws.com/cdn/widget/${appEnv}/img/flags/NL.jpg`}
                    />
                    <span>{I18N[lng]["tag_name"]} NL</span>
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
                      src={`https://tamtam.s3-eu-west-1.amazonaws.com/cdn/widget/${appEnv}/img/flags/EN.jpg`}
                    />
                    <span>{I18N[lng]["tag_name"]} EN</span>
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
                    <Button
                      variant="primary"
                      style={{ paddingTop: "15px", paddingBottom: "15px" }}
                      className={styles.controls__ok}
                    >
                      <Loader
                        style={{
                          height: "10px",
                        }}
                        color={"#fff"}
                      />
                    </Button>
                  ) : (
                    <Button onClick={saveTranslateTag} variant="primary">
                      {I18N[lng]["save"]}
                    </Button>
                  )}
                </div>
              </div>

              <div className={styles.modalTag_right}>
                <h3>SuperTag</h3>

                {!editTag?.isSuperTag && (
                  <>
                    <div className={styles.formRow}>
                      <label className={styles.configLabel}>
                        {I18N[lng]["select_supertag"]}
                      </label>
                      <AsyncSelect
                        cacheOptions
                        isClearable
                        value={superTag}
                        styles={props.selectStyles}
                        onChange={(e) => setSuperTag(e)}
                        loadOptions={fetchSuperTags}
                        classNamePrefix="custom-select"
                      />
                    </div>

                    <div className={styles.superTag_box}>
                      {!editTag.superTag && (
                        <>
                          <p className={styles.superTag_title}>
                            <span>{I18N[lng]["apply_all_tags"]}</span>
                            <Switch
                              isChecked={applyAllSelection}
                              onChange={(e) => setApplyAllSelection(e)}
                            />
                          </p>

                          <p className={styles.tags_list}>
                            {tags?.map((tag) =>
                              !tag.tag.isSuperTag && !tag.tag.superTag ? (
                                <span className={styles.tag}>{tag.label}</span>
                              ) : null
                            )}
                          </p>
                        </>
                      )}
                    </div>
                  </>
                )}

                <div className={styles.formRow}>
                  <label className={styles.configLabel}>
                    {I18N[lng]["theme"]}
                  </label>
                  <AsyncSelect
                    cacheOptions
                    styles={props.selectStyles}
                    value={theme}
                    onChange={handleChangeTheme}
                    isLoading={loadingThemes}
                    loadOptions={fetchThemes}
                    defaultOptions={true}
                    getOptionLabel={(option) => option.title}
                    getOptionValue={(option) => option.id}
                    placeholder={I18N[lng]["select_theme"]}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formRow}>
                  <label className={styles.configLabel}>
                    {I18N[lng]["page"]}
                  </label>
                  <Select
                    styles={props.selectStyles}
                    isLoading={loadingThemes}
                    options={pageOptions}
                    className={styles.input}
                    placeholder={I18N[lng]["select_page"]}
                    value={pages}
                    getOptionLabel={(option) => option.title}
                    getOptionValue={(option) => option.id}
                    onChange={(e) => setPages(e)}
                    isMulti
                  />
                </div>

                <div className={styles.modalTag_controls}>
                  {savingSuperTag ? (
                    <Button
                      variant="primary"
                      style={{ paddingTop: "15px", paddingBottom: "15px" }}
                      className={styles.controls__ok}
                    >
                      <Loader
                        style={{
                          height: "10px",
                        }}
                        color={"#fff"}
                      />
                    </Button>
                  ) : (
                    <Button onClick={handleSaveSuperTag} variant="primary">
                      {I18N[lng]["save"]}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.modalTag_footer}>
              <Button
                onClick={() => {
                  setOpenTagModal(false);
                  setSuperTag(null);
                }}
                variant="default"
              >
                {I18N[lng]["cancel"]}
              </Button>
            </div>
          </>
        )}
      </AntModal>
      <TagMergeModal
        openModal={openMergeModal}
        setOpenModal={setOpenMergeModal}
        lng={lng}
        tags={searchTags}
        afterMerge={() => handleAfterMerge()}
        I18N={I18N}
        apiUrl={apiUrl}
        token={token}
      />
    </>
  );
};

export default Tag;
