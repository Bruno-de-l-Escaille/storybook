"use clinet";

import React, { useEffect, useRef } from "react";
import { useState } from "react";
import style from "./book-registration.module.scss";
import { RegistrationFullSteps, RegistrationQuickSteps } from "./enums";
// import { Onboarding } from "./onboarding";
import StepAddress from "./step-address/step-address";
import StepPayment from "./step-payment/step-payment";
import {
  fetchBillingAddress,
  fetchBillingConfiguration,
} from "../../../../api/adress";
import { getApiUrl } from "../../../../utils";

export function BookRegistartaion({
  token,
  product,
  user,
  language,
  env,
  fiduciaire,
  closeModal,
}) {
  console.log("test");
  const [step, setStep] = useState(RegistrationQuickSteps.ADDRESS);
  const [savedStep, setSavedStep] = useState(
    localStorage.getItem("book_step")
      ? Number(localStorage.getItem("book_step"))
      : RegistrationQuickSteps.ADDRESS
  );
  const stepRef = useRef(savedStep);
  const [, forceRender] = useState(0); // juste pour déclencher un re-render quand step change

  console.log("localStorage", localStorage.getItem("book_step"));

  const [userBillingAdress, setUserBillingAddress] = useState([]);
  const [isFetchingAdress, setIsFetchingAdress] = useState(false);
  const [billingConfig, setBillingConfig] = useState(null);
  useEffect(() => {
    const fetchUserBillingAddress = async () => {
      setIsFetchingAdress(true);

      try {
        const data = await fetchBillingAddress(token, getApiUrl(env), user?.id);
        setUserBillingAddress(data?.data ?? []);
      } catch (err) {
        console.error("Error fetching user billing address:", err);
      } finally {
        setIsFetchingAdress(false);
      }
    };

    const fetchBillingConfig = async () => {
      const productOrganizationId = product?.issuer?.id;

      if (!productOrganizationId) return;

      try {
        const response = await fetchBillingConfiguration({
          token,
          apiUrl: getApiUrl(env),
          organizationId: productOrganizationId,
        });

        setBillingConfig(response?.data?.data?.[0] || null);
      } catch (err) {
        console.error("Error fetching organization billing address:", err);
      }
    };

    fetchUserBillingAddress();
    fetchBillingConfig();
  }, [env, token, user]);

  const [order, setOrder] = useState(null);
  console.log("step", step, "stepRef", stepRef, "savedStep", savedStep);
  // const searchParams = useSearchParams();
  const goToStep = (nextStep) => {
    console.log("nextStep", nextStep);
    stepRef.current = nextStep;
    setSavedStep(nextStep);
    localStorage.setItem("book_step", nextStep);
    setStep(nextStep);
  };

  const titleUpdated =
    product.title.length > 105
      ? `${product.title.slice(0, 105)}...`
      : product.title;
  return (
    <div
      className={`${style.book_registration} ${
        stepRef.current === RegistrationQuickSteps.ADDRESS ? style.grid : ""
      }`}
    >
      <div className={style.header}>
        <span>{titleUpdated}</span>
        <span className={style.modalClose} onClick={closeModal}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.85888 7.99949L6.50533 7.64594L0.959195 2.09981C0.643914 1.78453 0.64395 1.2734 0.959169 0.958228L0.959195 0.958202C1.27446 0.642936 1.78553 0.642936 2.1008 0.958202L7.64701 6.50441L8.00056 6.85796L8.35412 6.50441L13.9003 0.958129C13.9003 0.958129 13.9003 0.958128 13.9003 0.958127C14.2156 0.642872 14.7266 0.642864 15.0419 0.958104C15.0419 0.958112 15.0419 0.958121 15.0419 0.958129M6.85888 7.99949L15.0419 0.958129M6.85888 7.99949L6.50533 8.35305M6.85888 7.99949L6.50533 8.35305M15.0419 0.958129C15.3571 1.27342 15.3571 1.78456 15.0419 2.09973M15.0419 0.958129L15.0419 2.09973M15.0419 2.09973C15.0419 2.09973 15.0419 2.09973 15.0419 2.09973M15.0419 2.09973L15.0419 2.09973M15.0419 2.09973L9.49572 7.64587M15.0419 2.09973L9.49572 7.64587M6.50533 8.35305L0.959195 13.8992C0.643929 14.2144 0.643929 14.7255 0.959195 15.0408C1.27447 15.3561 1.7856 15.356 2.10077 15.0408L2.1008 15.0408L7.64701 9.49458L8.00056 9.14103L8.35411 9.49458L13.9003 15.0408C14.2156 15.3561 14.7267 15.3561 15.0419 15.0408C15.3571 14.7256 15.3571 14.2145 15.0419 13.8992C15.0419 13.8992 15.0419 13.8992 15.0419 13.8992L9.49572 8.35297L9.14216 7.99942M6.50533 8.35305L9.14216 7.99942M9.14216 7.99942L9.49572 7.64587M9.14216 7.99942L9.49572 7.64587"
              fill="#E9FFDE"
              stroke="#E9FFDE"
            />
          </svg>
        </span>
      </div>
      {/* <Onboarding
        selectedTab={
          stepRef.current === RegistrationQuickSteps.ADDRESS
            ? "Address"
            : "Payment"
        }
        title={titleUpdated}
      >
        <></>
      </Onboarding> */}
      {stepRef.current === RegistrationQuickSteps.ADDRESS && (
        // "testElement"
        <StepAddress
          theme="blue"
          onboardingNavsMobile={undefined}
          currentStep={RegistrationFullSteps.ADDRESS}
          goToStep={goToStep}
          setOrder={setOrder}
          invoicingData={userBillingAdress}
          // handleUpdateRegistration={handleUpdateRegistration}
          previousStep={RegistrationFullSteps.PERSONAL_DATA}
          product={product}
          token={token}
          user={user}
          language={language}
          env={env}
          fiduciaire={fiduciaire}
          isPeppolActive={billingConfig?.isPeppolActive}
        />
      )}
      {stepRef.current === RegistrationQuickSteps.PAYMENT && (
        <StepPayment
          order={order}
          goToStep={goToStep}
          previousStep={RegistrationQuickSteps.ADDRESS}
          // OnboardingNavs={()}
          selectOneClickPayment={false}
          token={token}
          language={language}
          env={env}
        />
      )}
    </div>
  );
}
