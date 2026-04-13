import React from "react";
import Skeleton from "react-loading-skeleton";
import styles from "./PrintedTicket.module.scss";

export const PrintedTicketSkeleton = () => {
  return (
    <div className={styles.container}>
      <div className={styles.cardList}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.preview}>
                <Skeleton height={120} width={90} />
              </div>
              <div className={styles.info}>
                <h2 className={styles.labelTitle}>
                  <Skeleton width={220} />
                </h2>
                <div className={styles.details}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Invités :</span>
                    <span className={styles.detailValue}>
                      <Skeleton width={40} />
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Modèle :</span>
                    <span className={styles.detailValue}>
                      <Skeleton width={100} />
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>
                      Dimension d'étiquette :
                    </span>
                    <span className={styles.detailValue}>
                      <Skeleton width={80} />
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Généré le :</span>
                    <span className={styles.detailValue}>
                      <Skeleton width={80} />
                    </span>
                  </div>
                </div>
                <div className={styles.actions}>
                  <Skeleton width={60} height={30} style={{ marginRight: 8 }} />
                  <Skeleton width={90} height={30} style={{ marginRight: 8 }} />
                  <Skeleton width={30} height={30} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
