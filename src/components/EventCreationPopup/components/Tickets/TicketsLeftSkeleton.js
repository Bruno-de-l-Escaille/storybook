import React from "react";
import Skeleton from "react-loading-skeleton";
import styles from "./Tickets.module.scss";

export const TicketsLeftSkeleton = () => (
  <div className={styles.tickets_generateTickets}>
    <span className={styles.tickets_generateTickets_title}>
      <Skeleton width={180} height={24} />
    </span>
    <div className={styles.tickets_generateTickets_printCountWrapper}>
      <span className={styles.tickets_generateTickets_printCount}>
        <Skeleton width={40} height={32} />
      </span>
      <span className={styles.tickets_generateTickets_printLabel}>
        <Skeleton width={60} height={18} />
      </span>
    </div>
    <span className={styles.tickets_generateTickets_modelDescription}>
      <Skeleton width={260} height={18} />
    </span>
    <div className={styles.tickets_generateTickets_modelSelect}>
      <Skeleton width={320} height={48} />
    </div>
    <div style={{ marginTop: 24 }}>
      <Skeleton width={160} height={40} />
    </div>
  </div>
);
