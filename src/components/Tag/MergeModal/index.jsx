import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { toast } from "react-toastify";

import styles from "./MergeModal.module.scss";
import { mergeTags } from "../../../api";
import Button from "../Button";
import Loader from "../Loader";

export default function MergeModal({
  modalOpen,
  onClose,
  tags,
  afterMerge,
  lng,
  I18N,
  apiUrl,
  token,
}) {
  const nameAttr = `name${lng.charAt(0).toUpperCase() + lng.slice(1)}`;
  const [destination, setDestination] = useState(null);
  const [fullMerge, setFullMerge] = useState(false);
  const [merging, setMerging] = useState(false);
  useEffect(() => {
    if (tags.length === 2) {
      setDestination(tags[0].tag.id);
    }
  }, [tags]);

  const resetData = () => {
    setFullMerge(false);
    setDestination(null);
    onClose();
  };

  const merge = async () => {
    try {
      setMerging(true);
      await mergeTags({
        token,
        apiUrl,
        data: {
          destination,
          fullMerge,
          source: tags.filter((el) => el.tag.id !== destination)[0].tag.id,
        },
      });
      setMerging(false);
      if (afterMerge) afterMerge();
      resetData();
      toast.success(I18N[lng].saved_successfully);
    } catch (error) {
      setMerging(false);
      toast.error(I18N[lng].error_occurred);
    }
  };

  if (tags.length < 2) {
    return null;
  }

  return (
    <Modal
      className={styles.modal}
      title={""}
      open={modalOpen}
      onCancel={() => onClose()}
      footer={[]}
      zIndex="99999"
    >
      <p className={styles.question}>
        {I18N[lng].merge_question}{" "}
        <strong>
          <em>
            {tags[0].tag[nameAttr]}(#{tags[0].tag.id})
          </em>
        </strong>{" "}
        {I18N[lng].and}{" "}
        <strong>
          <em>
            {tags[1].tag[nameAttr]}(#{tags[1].tag.id})
          </em>
        </strong>{" "}
        ?
      </p>

      <select
        value={destination}
        onChange={(e) => setDestination(parseInt(e.target.value))}
      >
        {tags.map((tag) => (
          <option value={tag.tag.id}>
            {I18N[lng].keep} {tag.tag[nameAttr]}(#{tag.tag.id}){" "}
            {I18N[lng].as_principle}
          </option>
        ))}
      </select>

      <div className={styles.inputForm}>
        <input
          type="checkbox"
          name="check"
          id="check"
          value={fullMerge}
          onChange={() => setFullMerge(!fullMerge)}
        />
        <label htmlFor="check"> {I18N[lng].merge_and_delete} </label>
      </div>
      <div className={styles.actions}>
        <Button onClick={() => resetData()} variant="default">
          {I18N[lng].cancel}
        </Button>

        {merging ? (
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
          <Button onClick={merge} variant="primary">
            {I18N[lng].merge}
          </Button>
        )}
      </div>
    </Modal>
  );
}
