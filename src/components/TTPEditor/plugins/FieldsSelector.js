import React, { useEffect, useState } from "react";
import Modal from "react-modal";

import IconClose from "../../Icons/IconClose";

import { I18N } from "../../../i18n";
import styles from "./FieldsSelector.module.scss";
import StyledTabs from "./StyledTabs";

const FieldsSelector = ({
  isOpen,
  onCancel,
  lng,
  dynamicFields,
  onAddField,
}) => {
  const [activeTab, setActiveTab] = useState("");
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    if (dynamicFields) {
      let activeTabAdded = false;
      const t = Object.keys(dynamicFields).map((key) => {
        if (key === "RECIPIENT") {
          setActiveTab(key);
          activeTabAdded = true;
        }
        return {
          key,
          title: key.toLowerCase(),
        };
      });
      if (!activeTabAdded && t.length > 0) {
        setActiveTab(t[0].key);
      }
      setTabs(t);
    }
  }, [dynamicFields]);

  // const onAddField = (code) => {};

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      className={{
        base: styles.modalContent,
        afterOpen: styles.modalContentAfterOpen,
        beforeClose: styles.modalContentBeforeClose,
      }}
      overlayClassName={styles.modalOverlay}
      closeTimeoutMS={200}
    >
      <div className={`${styles.confirm} `}>
        <div className={styles.header}>
          {I18N[lng].customize_dynamic_fields}
        </div>
        <div className={styles.close} onClick={onCancel}>
          <IconClose width={14} />
        </div>
        <div className={styles.body}>
          <div className="fields-selector">
            {tabs.length > 0 ? (
              <StyledTabs
                active={activeTab}
                tabs={tabs}
                setActiveTab={setActiveTab}
              >
                <div className="fields-selector__items">
                  {dynamicFields[activeTab] &&
                    dynamicFields[activeTab].length > 0 &&
                    dynamicFields[activeTab].map(({ code, title }) => (
                      <span
                        key={code}
                        onClick={() => {
                          onAddField(code);
                          onCancel();
                        }}
                        dangerouslySetInnerHTML={{
                          __html: (title[lng]
                            ? `${title[lng]}`
                            : ""
                          ).toUpperCase(),
                        }}
                      ></span>
                    ))}
                </div>
              </StyledTabs>
            ) : (
              <p>Aucun champ disponible</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FieldsSelector;
