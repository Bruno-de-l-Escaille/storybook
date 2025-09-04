import { useModal } from "../use-modal";

export const useFiduciaireRegistrationTypeModal = () => {
  const { openModal, ...modalContext } = useModal();

  const openFiduciaireRegistrationTypeModal = (
    token,
    product,
    user,
    language,
    env,
    fiduciaires
  ) => {
    return openModal("FIDUCIAIRE_REGISTRATION_TYPE", {
      data: { token, product, user, language, env, fiduciaires },
    });
  };

  return { ...modalContext, openFiduciaireRegistrationTypeModal };
};
