import React, { ReactNode, Suspense } from "react";

const withSuspense = (Component, Fallback) => {
  function suspense(props) {
    return (
      <Suspense
        fallback={
          typeof Fallback === "function" ? <Fallback {...props} /> : Fallback
        }
      >
        <Component {...props} />
      </Suspense>
    );
  }

  return suspense;
};

export default withSuspense;
