"use client";

import React, { ElementType, useLayoutEffect, useRef } from "react";
import shave from "shave";
import { useWindowSize } from "@/common/hooks/use-window";

/**
 * This is wrapper component of the vanilla JavaScript library 'shave' to easily reuse it throughout
 * the app and stay in “React Mode”.
 */
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
      // Text is shaved off when its container has children, namely two spans (end character, remaining text) and a text node.
      setHasMore?.(!!contentRef.current?.childElementCount);
    }
  }, [maxHeight, isEnabled, windowSize, setHasMore]);

  return (
    <Tag className={className} key={String(isEnabled)} ref={contentRef}>
      <div>{children}</div>
    </Tag>
  );
}
