import React, { useLayoutEffect, useRef } from "react";
import shave from "shave";
import { useWindowSize } from "../../hooks/useWindow";

export default function Shave({
  children,
  maxHeight,
  isEnabled = true,
  as: Tag = "div",
  className,
  setHasMore,
}) {
  const contentRef = useRef(null);
  const windowSize = useWindowSize();

  useLayoutEffect(() => {
    if (isEnabled) {
      shave(contentRef.current, maxHeight, {
        character: " ...",
      });
      if (setHasMore) {
        setHasMore(!!contentRef.current?.childElementCount);
      }
    }
  }, [maxHeight, isEnabled, windowSize, setHasMore]);

  return (
    <Tag className={className} key={String(isEnabled)} ref={contentRef}>
      <div>{children}</div>
    </Tag>
  );
}
