import React, { createContext, useMemo, useReducer } from "react";
import { modalReducer } from "./reducer";
// import { ModalContextType, ModalIdType, OpenModalParams } from "./types";

const initialState = {
  isOpen: false,
  modalId: "",
  data: {},
  // action: undefined,
  onClose: undefined,
  onSuccess: undefined,
  onCancel: undefined,
};

export const ModalContext = createContext(initialState);

export function ModalProvider({ children }) {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  const openModal = (modalId, params) => {
    return dispatch({
      type: "OPEN_MODAL",
      modalId,
      ...params,
    });
  };
  const closeModal = () => dispatch({ type: "CLOSE_MODAL" });

  const value = useMemo(
    () => ({
      modal: state,
      openModal,
      closeModal,
    }),
    [state]
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}
