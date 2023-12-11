import React, { useState, useEffect } from "react";
import { Modal as AntModal } from "antd";

import Button from "./Button";
import MergeModal from "./MergeModal";
import styles from "./Tag.module.scss";
import homeStyles from "./Tag.module.scss";

export default function TagMergeModal({
  openModal,
  setOpenModal,
  lng,
  tags,
  afterMerge,
  I18N,
  apiUrl,
  token,
}) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [mergeModalOpen, setMergeModalOpen] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const checkItem = (id) => {
    if (selectedTags.includes(id)) {
      setSelectedTags(selectedTags.filter((el) => el !== id));
    } else {
      setSelectedTags([...selectedTags, id]);
    }
  };

  const getNames = (tag) => {
    return (
      <ul className={styles.namesList}>
        {tag.nameFr && tag.nameFr.length > 0 && <li>{tag.nameFr}</li>}
        {tag.nameEn && tag.nameEn.length > 0 && <li>{tag.nameEn}</li>}
        {tag.nameNl && tag.nameNl.length > 0 && <li>{tag.nameNl}</li>}
      </ul>
    );
  };

  return (
    <>
      <AntModal
        closable={false}
        open={openModal}
        maskClosable={false}
        width="65vw"
        height="45vh"
        footer={null}
        onCancel={() => handleCloseModal()}
        destroyOnClose={true}
        zIndex="9999"
        styles={{
          content: {
            padding: "0",
          },
        }}
      >
        <div className={homeStyles.modal_header}>{I18N[lng].merge}</div>
        <div
          className={homeStyles.modal_close}
          onClick={() => handleCloseModal()}
        >
          <svg width={17} height={17} viewBox="0 0 17 17" fill="none">
            <path
              d="M6.47932 8.49955L0.418184 2.43842C-0.13975 1.88049 -0.13975 0.975897 0.418184 0.418042C0.97612 -0.139892 1.88063 -0.139892 2.43856 0.418042L8.49978 6.47925L14.561 0.417963C15.1189 -0.139972 16.0234 -0.139972 16.5814 0.417963C17.1392 0.975897 17.1392 1.88049 16.5814 2.43834L10.5202 8.49947L16.5814 14.5607C17.1392 15.1186 17.1392 16.0232 16.5814 16.5811C16.0234 17.139 15.1189 17.139 14.561 16.5811L8.49978 10.5198L2.43856 16.5811C1.88071 17.139 0.97612 17.139 0.418184 16.5811C-0.13975 16.0231 -0.13975 15.1186 0.418184 14.5607L6.47932 8.49955Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className={homeStyles.modal_body}>
          <div className={styles.bar}>
            <Button
              disabled={selectedTags.length < 2}
              className={`${styles.btn} ${
                selectedTags.length < 2 ? styles.disabled : ""
              }`}
              onClick={() => setMergeModalOpen(true)}
            >
              {I18N[lng].merge}
            </Button>
          </div>
          <div className={styles.table_data}>
            <table className={styles.tags_table}>
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                  <th>{I18N[lng].name}</th>
                  <th>{I18N[lng].usage_counter}</th>
                </tr>
              </thead>
              <tbody>
                {tags.length > 0 &&
                  tags.map((tag) => (
                    <tr key={tag.value}>
                      <td className={styles.cell}>
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag.value)}
                          onChange={() => checkItem(tag.value)}
                        />
                      </td>
                      <td className={styles.cell}>{`#${tag.value}`}</td>
                      <td className={styles.cell}>{getNames(tag.tag)}</td>
                      <td className={styles.cell}>{tag.tag.counter}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </AntModal>
      <MergeModal
        modalOpen={mergeModalOpen}
        onClose={() => {
          setSelectedTags([]);
          setMergeModalOpen(false);
        }}
        tags={tags.filter((el) => selectedTags.includes(el.tag.id))}
        lng={lng}
        I18N={I18N}
        afterMerge={afterMerge}
        apiUrl={apiUrl}
        token={token}
      />
    </>
  );
}
