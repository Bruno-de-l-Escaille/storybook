import React, { useState, useRef } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import styles from "./Editor.module.scss";
import { I18N } from "../../../../i18n";
import IconImage from "../../../Icons/IconImage";

export const Editor = (props) => {
  const {
    language,
    data,
    setData,
    validationErrors,
    setValidationErrors,
  } = props;
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const editorRef = useRef();

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData((prevData) => ({
          ...prevData,
          image: reader.result,
          imageFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData((prevData) => ({
          ...prevData,
          image: reader.result,
          imageFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTitleChange = (e) => {
    const titleField = `name${
      language.charAt(0).toUpperCase() + language.slice(1)
    }`;
    setData((prevData) => ({ ...prevData, [titleField]: e.target.value }));
    if (validationErrors.titleError) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        titleError: false,
      }));
    }
  };

  const handleDescriptionChange = (content) => {
    const descriptionField = `description${
      language.charAt(0).toUpperCase() + language.slice(1)
    }`;
    setData((prevData) => ({ ...prevData, [descriptionField]: content }));
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();

    const urlBannerField = `urlBanner${
      language.charAt(0).toUpperCase() + language.slice(1)
    }`;

    setData((prevData) => ({
      ...prevData,
      image: "",
      imageFile: null,
      [urlBannerField]: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const editorButtonList = [
    ["undo", "redo"],
    ["fontSize", "formatBlock"],
    ["bold", "underline", "italic", "strike"],
    ["fontColor", "hiliteColor"],
    ["outdent", "indent"],
    ["align", "list"],
    ["link", "image"],
  ];

  return (
    <div className={styles.editor}>
      <div className={styles.editor_content}>
        <div
          className={`${styles.editor_imageUpload} ${
            isDragging ? styles.editor_imageUpload_dragging : ""
          }`}
          onClick={handleImageClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {data.image ? (
            <>
              <img
                src={data.image}
                alt="Event"
                className={styles.editor_imageUpload_image}
              />
              <button
                className={styles.editor_imageUpload_removeButton}
                onClick={handleRemoveImage}
                aria-label="Remove image"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M12 4L4 12M4 4L12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </>
          ) : (
            <div className={styles.editor_imageUpload_placeholder}>
              <div className={styles.editor_imageUpload_icon}>
                <IconImage />
              </div>
              <p className={styles.editor_imageUpload_text}>
                {I18N[language]["clickOrDragImage"]}
              </p>
              <p className={styles.editor_imageUpload_format}>
                {I18N[language]["imageFormat"]}
              </p>
              <button
                className={styles.editor_imageUpload_mediaButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick();
                }}
              >
                {I18N[language]["fromMedia"]}
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder={I18N[language]["eventTitle"]}
            value={
              data[
                `name${language.charAt(0).toUpperCase() + language.slice(1)}`
              ] || ""
            }
            onChange={handleTitleChange}
            className={`${styles.editor_titleInput} ${
              validationErrors.titleError ? styles.editor_titleInput_error : ""
            }`}
          />
          {validationErrors.titleError && (
            <span className={styles.editor_errorMessage}>
              {I18N[language]["titleRequired"]}
            </span>
          )}
        </div>
        <div className={styles.editor_descriptionEditor}>
          <SunEditor
            ref={editorRef}
            setContents={
              data[
                `description${
                  language.charAt(0).toUpperCase() + language.slice(1)
                }`
              ] || ""
            }
            onChange={handleDescriptionChange}
            setOptions={{
              height: "200",
              buttonList: editorButtonList,
              placeholder: `${I18N[language]["description"]}...`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
