import { useModal } from "../use-modal";

export const useRegistrationTypeModal = () => {
  const { openModal, ...modalContext } = useModal();

  const openRegistrationTypeModal = (data) => {
    return openModal("REGISTRATION_TYPE", { data });
  };

  return { ...modalContext, openRegistrationTypeModal };
};
