// import { ModalActionTypes, ModalState } from "./types";

const initialState = {
  isOpen: false,
  modalId: "",
  data: {},
  onClose: undefined,
  onSuccess: undefined,
  onCancel: undefined,
};

export const modalReducer = (state, action) => {
  switch (action.type) {
    case "CLOSE_MODAL": {
      return initialState;
    }
    case "OPEN_MODAL": {
      console.log("testelem", {
        ...state,
        isOpen: true,
        modalId: action.modalId,
        data: action.data,
        onClose: action.onClose,
        onSuccess: action.onSuccess,
        onCancel: action.onCancel,
      });
      return {
        ...state,
        isOpen: true,
        modalId: action.modalId,
        data: action.data,
        onClose: action.onClose,
        onSuccess: action.onSuccess,
        onCancel: action.onCancel,
      };
    }
    default:
      return state;
  }
};

export default modalReducer;
