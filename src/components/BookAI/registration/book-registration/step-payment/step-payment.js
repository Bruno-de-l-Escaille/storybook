import classNames from "classnames";
import React from "react";
// import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import s from "./step-payment.module.scss";
import { I18N } from "../../../../../i18n";
import { useResponsive } from "../../../../../common/hooks/useResponsive";
import { isEmpty } from "../../../../../utils";
import { NextStep } from "../next-step";
import { StepsContent } from "../steps-content";
import { StepsControl } from "../steps-control";
import { GoBack } from "../go-back";

function StepPayment({
  order,
  previousStep,
  // `  OnboardingNavs,`
  goToStep,
  selectOneClickPayment,
  fromMobileApp = false,
  token,
  language = "fr",
  env,
}) {
  const [showTerminate, setShowTerminate] = useState(false);

  const translate = (text) => {
    return I18N[language][text];
  };

  // const { closeBookEventRegistrationModal } = useEventBookRegistrationModal();
  var TTP_PAYMENT_URL = "";
  if (env === "production") {
    TTP_PAYMENT_URL = "https://billing.tamtam.pro";
  } else if (env === "staging") {
    TTP_PAYMENT_URL = "https://billing.staging.tamtam.pro";
  } else if (env === "preprod") {
    TTP_PAYMENT_URL = "https://billing.preprod.tamtam.pro";
  } else {
    TTP_PAYMENT_URL = "http://local.billing.tamtam.pro";
  }

  const { isMobile } = useResponsive();
  // const pathname = usePathname();

  const paymentUrl = useMemo(() => {
    if (!order) return "";

    let paymentUrl = `${TTP_PAYMENT_URL}/paymentMethode?orderID=${order.id}&token=${token}&embedded=1`;

    if (selectOneClickPayment) {
      paymentUrl += `&sepa=1`;
    }

    return paymentUrl;
  }, [order, selectOneClickPayment, token]);

  const isIframe = () => window.self !== window.top;

  useEffect(() => {
    if (isEmpty(paymentUrl)) {
      console.log("testpayment", paymentUrl);
      // goToStep(previousStep);
    } else if (isMobile) {
      if (!isIframe()) {
        window.location.href = paymentUrl;
      } else if (window.top) {
        window.top.location.href = paymentUrl;
      }
    }
  }, [goToStep, isMobile, paymentUrl, previousStep]);

  useEffect(() => {
    const handler = (e) => {
      const eventId = e?.data?.event;
      const message = e?.data?.message;
      const paymentIframe = document.getElementById("payment-full-iframe");

      switch (eventId) {
        case "PAYMENT_ONLINE":
          setShowTerminate(false);
          break;
        case "PAYMENT_TRANSFER":
          setShowTerminate(true);
          break;
        case "PAYMENT_ORDERS":
          setShowTerminate(false);
          break;
        case "RETRY_PAYMENT":
          setShowTerminate(false);
          paymentIframe.src += "";
          break;
        default:
          break;
      }

      if (message === "REDIRECT_TO_URL") {
        const url = e?.data?.url;
        window.open(url, "_self");
      }
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    };
  }, []);

  const handleFinish = () => {
    // closeBookEventRegistrationModal();
    if (!fromMobileApp) {
      // closeBookEventRegistrationModal();
    } else {
      // window.location.href = `${appInfo.url}${pathname}?openNCNApp=true`;
    }
  };

  return (
    <StepsContent className={s.content}>
      <div className={s.wrapper}>
        <iframe id="payment-full-iframe" title="payment" src={paymentUrl} />
      </div>
      <StepsControl>
        <div
          className={classNames(
            "p-s p-x-l flex-container align-justify",
            s.actions
          )}
        >
          {/* {isMobile && OnboardingNavs} */}
          <div>
            <GoBack
              onClick={() => goToStep(previousStep)}
              hideIcon
              language={language}
            />
          </div>
          {showTerminate && (
            <NextStep
              onClick={handleFinish}
              text={translate("common.finish")}
              hideIcon
              language={language}
            />
          )}
        </div>
      </StepsControl>
    </StepsContent>
  );
}

export default StepPayment;
