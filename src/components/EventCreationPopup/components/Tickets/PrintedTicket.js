import React, { useState, useEffect } from "react";
import styles from "./PrintedTicket.module.scss";
import { getApiUrl, prepareS3ResourceUrl } from "../../../../utils";
import IconDelete from "../../../Icons/IconDelete";
import IconDownloadV2 from "../../../Icons/IconDownloadV2";
import { I18N } from "../../../../i18n";
import { deleteLabel } from "../../../../api/event";
import { Toast } from "../../../ToastContainer/ToastContainer";

export const PrintedTicket = (props) => {
  const { labels, env, language, auth, setReload } = props;
  const [localLabels, setLocalLabels] = useState([]);
  const apiUrl = getApiUrl(env);
  const s3FolderUrl = `http://s3.tamtam.pro/${
    env === "v2" ? "production" : env
  }`;

  useEffect(() => {
    setLocalLabels(labels);
  }, [labels]);

  const handleDelete = (label) => {
    setLocalLabels(localLabels.filter((l) => l.labelFile !== label.labelFile));
    deleteLabel({
      apiUrl,
      token: auth.token,
      eventId: label.eventId,
      labelName: label.labelFile,
    })
      .then(() => {
        setReload((r) => r + 1);
        Toast.success(I18N[language]["ticketDeletedSuccessfully"]);
      })
      .catch((error) => {
        console.error("Error deleting label:", error);
        Toast.error(I18N[language]["errorDeletingTicket"]);
      });
  };

  const handleDownload = (label) => {
    const pdfUrl = prepareS3ResourceUrl(
      s3FolderUrl,
      `client${label.clientId}/event${label.eventId}/labels/${label.labelFile}`
    );

    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = () => {
      const blob = xhr.response;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = label.labelFile;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    };
    xhr.open("GET", pdfUrl);
    xhr.send();
  };

  return (
    <div className={styles.container}>
      <span className={styles.title}>{I18N[language]["ticketsList"]}</span>
      <div className={styles.cardList}>
        {localLabels.map((label) => (
          <div key={label.labelFile} className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.preview}>
                <img
                  src={prepareS3ResourceUrl(
                    s3FolderUrl,
                    `client${label.clientId}/event${label.eventId}/labels/${label.labelFile}/w180.jpg`
                  )}
                  alt="PDF Preview"
                  className={styles.previewImage}
                  onError={(e) => {
                    e.target.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280"%3E%3Crect width="200" height="280" fill="%23f5f5f5"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="14" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3EPDF Preview%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
              <div className={styles.info}>
                <h2 className={styles.labelTitle}>{label.labelFile}</h2>
                <div className={styles.details}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>
                      {I18N[language]["guests"]} :
                    </span>
                    <span className={styles.detailValue}>
                      {label.guestsCount}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>
                      {I18N[language]["model"]} :
                    </span>
                    <span className={styles.detailValue}>
                      {label.modelName}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>
                      {I18N[language]["ticketDimension"]} :
                    </span>
                    <span className={styles.detailValue}>
                      {label.dimension}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>
                      {I18N[language]["generatedAt"]} :
                    </span>
                    <span className={styles.detailValue}>
                      {label.generatedTime}
                    </span>
                  </div>
                </div>
                <div className={styles.actions}>
                  <a
                    className={styles.buttonSecondary}
                    href={prepareS3ResourceUrl(
                      s3FolderUrl,
                      `client${label.clientId}/event${label.eventId}/labels/${label.labelFile}`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {I18N[language]["open"]}
                  </a>
                  <button
                    className={styles.buttonSecondary}
                    onClick={() => handleDownload(label)}
                  >
                    <IconDownloadV2 />
                    {I18N[language]["download"]}
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(label)}
                  >
                    <IconDelete />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
