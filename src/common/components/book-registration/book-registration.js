"use clinet";

import React, { useEffect } from "react";
import { useState } from "react";
import style from "./book-registration.module.scss";
import { RegistrationFullSteps, RegistrationQuickSteps } from "./enums";
import { Onboarding } from "./onboarding";
import StepAddress from "./step-address/step-address";
import StepPayment from "./step-payment/step-payment";
import { fetchBillingAddress } from "../../../api/adress";
import { getApiUrl } from "../../../utils";

export function BookRegistartaion({
  token,
  product,
  user,
  language,
  env,
  fiduciaire,
}) {
  const [step, setStep] = useState(RegistrationQuickSteps.ADDRESS);
  const [userBillingAdress, setUserBillingAddress] = useState([]);
  const [isFetchingAdress, setIsFetchingAdress] = useState(false);
  useEffect(() => {
    const fetchUserBillingAddress = async () => {
      setIsFetchingAdress(true);

      try {
        const data = await fetchBillingAddress(token, getApiUrl(env), user?.id);
        setUserBillingAddress(data?.data ?? []);
      } catch (err) {
        console.error("Error fetching user billing address:", err);
      } finally {
        setIsFetchingAdress(true);
      }
    };
    fetchUserBillingAddress();
  }, [env, token, user]);

  const [order, setOrder] = useState(null);

  // const searchParams = useSearchParams();

  // if (isFetching) {
  //   return <TTPLoader />;
  // }
  const titleUpdated =
    product.title.length > 105
      ? `${product.title.slice(0, 105)}...`
      : product.title;
  return (
    <div
      className={`${style.book_registration} ${
        step === RegistrationQuickSteps.ADDRESS ? style.grid : ""
      }`}
    >
      <Onboarding selectedTab="Address" title={titleUpdated}>
        <></>
      </Onboarding>
      {step === RegistrationQuickSteps.ADDRESS && (
        // "testElement"
        <StepAddress
          theme="blue"
          onboardingNavsMobile={undefined}
          currentStep={RegistrationFullSteps.ADDRESS}
          goToStep={setStep}
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
        />
      )}
      {step === RegistrationQuickSteps.PAYMENT && (
        <StepPayment
          order={order}
          goToStep={setStep}
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
