import { Pagination } from "antd";
import cn from "classnames";
import React from "react";
import { I18N } from "../../../../i18n";
import styles from "./Pagination.module.scss";

function CustomPagination({
  current,
  total,
  onChange,
  pageSize = 1,
  showSizeChanger = false,
  className,
  language,
  ...restProps
}) {
  const itemRender = (page, type, originalElement) => {
    if (type === "prev") {
      return <div className={styles.navButton}>{I18N[language].previous}</div>;
    }

    if (type === "next") {
      return <div className={styles.navButton}>{I18N[language].next}</div>;
    }

    // if (type === 'page') {
    //   const isActive = current === page;
    //   return <div className={cn(styles.pageItem, isActive && styles.active)}>{page}</div>;
    // }

    // if (type === 'jump-prev' || type === 'jump-next') {
    //   return <div className={styles.ellipsis}>...</div>;
    // }

    return originalElement;
  };

  return (
    <Pagination
      current={current}
      total={total}
      pageSize={pageSize}
      onChange={onChange}
      showSizeChanger={showSizeChanger}
      itemRender={itemRender}
      className={cn(styles.pagination, className)}
      {...restProps}
    />
  );
}

export default CustomPagination;
