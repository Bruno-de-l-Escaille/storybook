import React, { useState, useRef, useEffect } from "react";
import styles from "./EmailTagsInput.module.scss";
import IconTrash from "../../../../Icons/IconTrash2";
import { I18N } from "../../../../../i18n";

const EmailTagsInput = ({ tags, setTags, lang }) => {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef(null);

  const isValidEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const addTag = (tag) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setInputValue("");
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const clearAllTags = () => {
    setTags([]);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    const confirmKeys = [13, 32, 188];

    if (e.keyCode === 9) {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (confirmKeys.includes(e.keyCode)) {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.keyCode === 8 && !inputValue) {
      e.preventDefault();
      if (tags.length > 0) {
        removeTag(tags.length - 1);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("Text");
    const newTags = pastedText.split(/[ ,;\r\t\n]+/);

    newTags.forEach((tag) => {
      const trimmedTag = tag.trim();
      if (trimmedTag && !tags.includes(trimmedTag)) {
        setTags((prevTags) => [...prevTags, trimmedTag]);
      }
    });
    setInputValue("");
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const handleContainerClick = (e) => {
    if (e.target.classList.contains(styles.bootstrapTagsinput)) {
      textareaRef.current.focus();
    }
  };

  const isOkButtonDisabled = tags.length === 0;

  return (
    <div className={styles.container}>
      <div className={styles.colMd12}>
        <div
          className={styles.bootstrapTagsinput}
          onClick={handleContainerClick}
        >
          <div className={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`${styles.tag} ${styles.label} ${
                  isValidEmail(tag) ? styles.labelInfo : styles.labelDanger
                }`}
              >
                {tag}
                <span
                  className={styles.tagRemove}
                  onClick={() => removeTag(index)}
                ></span>
              </span>
            ))}
          </div>

          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onBlur={handleBlur}
            className={styles.tagsinputTextarea}
            placeholder={
              tags.length === 0
                ? I18N[lang]["enterOrPasteAListOfEmailAddresses"] ??
                  "Introduisez ou collez une liste d'adresse emails. "
                : ""
            }
            rows={1}
          />
        </div>
        <div className={styles.trashIcon} onClick={clearAllTags}>
          <IconTrash fill="#FC5D2B" />
        </div>

        <div className={styles.addByListCount}>
          {tags.length} {I18N[lang]["totalUsers"] ?? "utilisateur(s) au total"}
        </div>
      </div>
    </div>
  );
};

export default EmailTagsInput;
