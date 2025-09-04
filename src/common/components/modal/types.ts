
export interface ModalState<T = any> {
  isOpen: boolean;
  modalId: ModalIdType;
  data: T;
  onClose?: () => void;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export type ModalIdType =
  | ''
  | 'SESSION'
  | 'AD_CONFIRM'
  | 'INFO'
  | 'EventQuick'
  | 'CYCLE_DETAILS'
  | 'PAYMENT'
  | 'EVENT_FULL_REGISTRATION'
  | 'PACK_REGISTRATION'
  | 'SPEAKER'
  | 'CONFIRMATION'
  | 'OPTIONS_CONFIRMATION'
  | 'EVENT_POPUP'
  | 'WATCH'
  | 'WATCH_SEARCH'
  | 'EVENT_FREE_REGISTRATION'
  | 'EVENT_CANCEL_REGISTRATION'
  | 'INSCRIPTION_DETAILS'
  | 'INSCRIPTION_QUICK_DETAILS'
  | 'FILTERS_POPUP'
  | 'TAG_EDIT'
  | 'MENU'
  | 'DOCUMENT_VIEWER'
  | 'EVENT_QUICK_REGISTRATION'
  | 'CYCLE_REGISTRATION'
  | 'ONE_CLICK_PAYMENT'
  | 'ADD_AGREATION_NUMBER'
  | 'LIGHTBOX'
  | 'REGISTRATION_TYPE'
  | 'PLACES_PURCHASE'
  | 'SHOW_ALL_DOCS'
  | 'EVENT_BOOK_REGISTRATION';

export interface CloseModalAction {
  type: 'CLOSE_MODAL';
}

export interface OpenModalAction {
  type: 'OPEN_MODAL';
  modalId: ModalIdType;
  data: any;
  onClose?: () => void;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export type ModalActionTypes = OpenModalAction | CloseModalAction;

export interface OpenModalParams<T = any> {
  data: T;
  onClose?: () => void;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface ModalContextType {
  modal: ModalState;
  openModal: <T = any>(modalId: ModalIdType, params: OpenModalParams<T>) => void;
  closeModal: () => void;
}
