import React from "react";

export default function OnboardingPage({ children, className, style, tab }) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
