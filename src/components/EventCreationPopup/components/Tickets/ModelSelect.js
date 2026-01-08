import React, { useState, useMemo, useEffect } from "react";
import styles from "./ModelSelect.module.scss";
import IconArrowDown from "../../../Icons/IconArrowDown";
import IconArrowUp from "../../../Icons/IconArrowUp";
import IconCheckBlack from "../../../Icons/IconCheckBlack";
import { I18N } from "../../../../i18n";

export const ModelSelect = (props) => {
  const {
    labelTemplates,
    language,
    selectedModel,
    setSelectedModel,
    printCount,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const models = useMemo(() => {
    const grouped = labelTemplates.reduce((acc, template) => {
      const brand = template.brand;
      if (!acc[brand]) acc[brand] = [];
      const match =
        template.shortDescription &&
        template.shortDescription.match(/(.+?)\s*\((\d+)\)/);
      acc[brand].push({
        id: template.id,
        name:
          template[
            `label${language.charAt(0).toUpperCase() + language.slice(1)}`
          ],
        brand: brand,
        reference: template.reference,
        dimension: match && match[1] ? match[1].trim() : "",
        numberPerPage: match && match[2] ? Number(match[2]) : null,
      });
      return acc;
    }, {});
    return Object.keys(grouped).map((brand) => ({
      brand,
      items: grouped[brand],
    }));
  }, [labelTemplates, language]);

  useEffect(() => {
    if (localStorage.getItem("selectedTicketModelId")) {
      const modelId = Number(localStorage.getItem("selectedTicketModelId"));
      for (const model of models) {
        const found = model.items.find((item) => item.id === modelId);
        if (found) {
          setSelectedModel(found);
          setInputValue(found.brand + " " + found.reference);
          break;
        }
      }
    }
  }, [models]);

  const handleChangeInputValue = (e) => {
    const value = e.target.value;
    if (value === "") {
      setSelectedModel(null);
      setIsOpen(false);
    }
  };

  const handleSelect = (item) => {
    localStorage.setItem("selectedTicketModelId", item.id);
    setSelectedModel(item);
    setInputValue(item.brand + " " + item.reference);
    setIsOpen(false);
  };

  return (
    <div className={styles.modelSelector}>
      <div className={styles.selectorHeader}>
        <input
          type="text"
          className={`${styles.searchInput} ${
            selectedModel ? styles.searchInputBrandSelected : ""
          }`}
          placeholder={I18N[language]["chooseAModel"]}
          value={inputValue}
          onChange={handleChangeInputValue}
          onFocus={() => setIsOpen(printCount > 0)}
        />
        <button
          className={styles.modelButton}
          onClick={() => setIsOpen(!isOpen)}
          disabled={printCount === 0}
        >
          <span>{I18N[language]["model"]}</span>
          {isOpen ? <IconArrowUp /> : <IconArrowDown />}
        </button>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {models.map((brand) => (
            <div key={brand.brand} className={styles.brandSection}>
              <div className={styles.brandName}>{brand.brand}</div>
              {brand.items.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.modelItem} ${
                    selectedModel?.id === item.id ? styles.selected : ""
                  }`}
                  onClick={() => handleSelect(item)}
                >
                  <div>
                    <span className={styles.modelReference}>
                      {item.reference}
                    </span>{" "}
                    <span className={styles.modelText}>{item.name}</span>
                  </div>
                  {selectedModel?.id === item.id && <IconCheckBlack />}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
