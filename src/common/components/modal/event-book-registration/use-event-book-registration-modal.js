import { useQueryClient } from "@tanstack/react-query";
import { useModal } from "../use-modal";
// import { TTP_OECCBB_URL_AI } from '@/common/constants/env';
// import { useToken } from '@/common/hooks/use-token';
// import { Product } from '@/common/types/channel/interfaces';

export const useEventBookRegistrationModal = () => {
  const { openModal, ...modalContext } = useModal();
  // const queryClient = useQueryClient();
  const TTP_OECCBB_URL_AI = "https://www.oeccbb.be/fr/ia";

  const openBookEventRegistrationModal = (
    token,
    product,
    user,
    language,
    env,
    fiduciaire = null
  ) => {
    return openModal("EVENT_BOOK_REGISTRATION", {
      data: { token, product, user, language, env, fiduciaire },
      onSuccess: () => {
        if (typeof window !== "undefined") {
          window.location.href = `${TTP_OECCBB_URL_AI}`;
        }
      },
    });
  };

  const closeBookEventRegistrationModal = () => {
    modalContext.modal.onClose();
    modalContext.closeModal();
  };

  return {
    ...modalContext,
    openBookEventRegistrationModal,
    closeBookEventRegistrationModal,
  };
};
