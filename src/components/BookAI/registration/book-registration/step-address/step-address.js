import cn from "classnames";
import { ErrorMessage, Form, Formik } from "formik";
// import Link from "next/link";
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import * as yup from "yup";

import s from "./step-adress.module.scss";
import { RegistrationFullSteps, RegistrationQuickSteps } from "../enums";
import { useResponsive } from "../../../../../common/hooks/useResponsive";
import { getInitialValues } from "./services";
import { getAiUrl, isEmpty, parseBoolean, pick } from "../../../../../utils";
import { TTPCheckBoxField } from "../../../../../common/components/ttp-form/TTPCheckBox";
import LocalLoader, {
  LocalLoaderWrapper,
} from "../../../../../common/components/local-loader/local-loader";
import { StepsControl } from "../../../../../common/components/steps-control";
import GuestAddress from "./guest-address/guest-address";
import { NextStep } from "../next-step";
import { I18N } from "../../../../../i18n";
import { createOrder } from "../../../api";
import BookPurchaseSummary from "../book-purchase-summary/book-purchase-summary";

function StepAddress({
  theme,
  onboardingNavsMobile,
  currentStep,
  invoicingData,
  setOrder,
  goToStep,
  product,
  language = "fr",
  user,
  token,
  env,
  fiduciaire,
  isPeppolActive,
}) {
  const summaryStep = RegistrationQuickSteps.SUMMARY;

  const { isMobile } = useResponsive();

  const isSummaryStep = currentStep === summaryStep;
  const isLastStep = isSummaryStep || !isMobile;
  const [invoicingAddresses, setInvoicingAddresses] = useState(
    invoicingData ?? []
  );

  const hideInvoicingData = false;
  const hideTermsAndConditions = false;

  const translate = (text) => {
    return I18N[language][text];
  };

  const [initialValues, setInitialValues] = useState(
    getInitialValues(null, invoicingAddresses)
  );

  const [addressFormOpened, toggleAddressForm] = useState(
    isEmpty(initialValues.billingSignature) ||
      isEmpty(invoicingAddresses[0]?.organization)
  );

  useEffect(() => {
    if (
      currentStep !== RegistrationFullSteps.PAYMENT &&
      JSON.stringify(invoicingAddresses) !== JSON.stringify(invoicingData)
    ) {
      setInvoicingAddresses(invoicingData ?? []);
      setInitialValues(getInitialValues(null, invoicingAddresses));
      toggleAddressForm(
        isEmpty(initialValues.billingSignature) ||
          isEmpty(invoicingAddresses[0]?.organization)
      );
    }
  }, [invoicingData]);

  useEffect(() => {
    if (currentStep !== RegistrationFullSteps.PAYMENT) {
      setInitialValues(getInitialValues(null, invoicingAddresses));
      toggleAddressForm(
        isEmpty(initialValues.billingSignature) ||
          isEmpty(invoicingAddresses[0]?.signature)
      );
    }
  }, [initialValues.billingSignature, invoicingAddresses]);

  const isRequiredSchema = (schema, required, message = ""): any => {
    if (!required) {
      return schema;
    }

    return schema.required(message);
  };

  const validationSchema = yup.object().shape({
    termsOfSales: yup.string().when([], {
      is: () => !hideTermsAndConditions,
      then: () =>
        yup
          .string()
          .oneOf(["1"], translate("acceptCondition"))
          .required(translate("acceptCondition")),
      otherwise: () => yup.string().notRequired(),
    }),
    billingCompanyNumber: yup
      .string()
      .label(translate("billingCompanyNumber"))
      .when("billingSubjectToVAT", {
        is: (billingSubjectToVAT) =>
          !hideInvoicingData && parseBoolean(billingSubjectToVAT),
        then: () => yup.string().required(translate("required")),
      }),
    billingOrganization: isRequiredSchema(
      yup.string().label(translate("billingOrganization")),
      !hideInvoicingData,
      translate("required")
    ),
    billingStreet: isRequiredSchema(
      yup.string().label(translate("billingStreet")),
      !hideInvoicingData,
      translate("required")
    ),
    billingPostalCode: isRequiredSchema(
      yup.string().label(translate("billingPostalCode")), // Ex: '1360 Perwez',
      !hideInvoicingData,
      translate("required")
    ),
    billingSubjectToVAT: isRequiredSchema(
      yup.string().oneOf(["1", "0"]).label(translate("soumis_tva")),
      !hideInvoicingData,
      translate("required")
    ),
    privacyTerms: yup.string().when([], {
      is: () => !hideTermsAndConditions,
      then: () =>
        yup
          .string()
          .oneOf(["1"], translate("acceptPrivacy"))
          .required(translate("acceptPrivacy")),
      otherwise: () => yup.string().notRequired(),
    }),
  });

  const handleClickInvoice = (
    address,
    values,
    errors,
    touched,
    resetForm,
    setValues,
    reset = false
  ) => {
    resetForm({
      errors: {
        ...errors,
        billingCompanyNumber: undefined,
        billingOrganization: undefined,
        billingStreet: undefined,
        billingPostalCode: undefined,
        billingSubjectToVAT: undefined,
        billingSignature: undefined,
        billingRegion: undefined,
        billingDoNotSendInvoice: undefined,
      },
      touched: {
        ...touched,
        billingCompanyNumber: undefined,
        billingOrganization: undefined,
        billingStreet: undefined,
        billingPostalCode: undefined,
        billingSubjectToVAT: undefined,
        billingSignature: undefined,
        billingRegion: undefined,
        billingDoNotSendInvoice: undefined,
      },
    });

    if (reset) {
      setValues({
        ...values,
        billingCompanyNumber: "",
        billingOrganization: "",
        billingStreet: "",
        billingPostalCode: "",
        billingSubjectToVAT: "0",
        billingSignature: "",
        billingRegion: "",
        billingDoNotSendInvoice: false,
      });
    } else {
      setValues({
        ...values,
        billingCompanyNumber: address
          ? address.billingCompanyNumber
          : initialValues.billingCompanyNumber,
        billingOrganization: address
          ? address.billingOrganization
          : initialValues.billingOrganization,
        billingStreet: address
          ? address.billingStreet
          : initialValues.billingStreet,
        billingPostalCode: address
          ? address.billingPostalCode
          : initialValues.billingPostalCode,
        billingSubjectToVAT: address
          ? parseBoolean(address.billingSubjectToVAT)
            ? "1"
            : "0"
          : initialValues.billingSubjectToVAT,
        billingSignature: address
          ? address.billingSignature
          : initialValues.billingSignature,
        billingRegion: address
          ? address.billingRegion
          : initialValues.billingRegion,
        billingDoNotSendInvoice: address
          ? parseBoolean(address.billingDoNotSendInvoice)
          : initialValues.billingDoNotSendInvoice,
      });

      // handleChangeData({
      //   billingCompanyNumber: address
      //     ? address.billingCompanyNumber
      //     : initialValues.billingCompanyNumber,
      //   billingOrganization: address
      //     ? address.billingOrganization
      //     : initialValues.billingOrganization,
      //   billingStreet: address ? address.billingStreet : initialValues.billingStreet,
      //   billingPostalCode: address ? address.billingPostalCode : initialValues.billingPostalCode,
      //   billingSubjectToVAT: address
      //     ? parseBoolean(address.billingSubjectToVAT)
      //       ? '1'
      //       : '0'
      //     : initialValues.billingSubjectToVAT,
      //   billingSignature: address ? address.billingSignature : initialValues.billingSignature,
      // });
    }
  };

  const handleSubmit = (values, formikHelpers) => {
    const { setSubmitting } = formikHelpers;

    // if (!isLastStep) {
    //   resetForm();
    //   goToStep(summaryStep);
    //   return;
    // }

    const newData = {
      billingCompanyNumber: values.billingCompanyNumber,
      billingOrganization: values.billingOrganization,
      billingStreet: values.billingStreet,
      billingPostalCode: values.billingPostalCode,
      billingSubjectToVAT: values.billingSubjectToVAT,
      billingRegion: values.billingRegion,
      billingDoNotSendInvoice: parseBoolean(values.billingDoNotSendInvoice)
        ? 1
        : 0,
      user: user?.id,
      appRef: "paper-subscription",
      product_ids: `[${product.id}]`,
      fiduciaireId: fiduciaire?.id ?? 0,
    };

    return createOrder({
      token,
      AiUrl: getAiUrl(env),

      ...newData,
    })
      .then(({ data: order }) => {
        if (!order || !order.id) {
          setSubmitting(false);
          toast.error(translate("channel.commandErrorCreation"));
        } else {
          // toast.success("channel.commandSuccessCreation");
          goToStep(RegistrationFullSteps.PAYMENT);
          setOrder(order);
          // setSubmitting(true);
        }
      })
      .catch((error) => {
        setSubmitting(false);
        toast.error(translate("channel.commandErrorCreation"));
      });

    // return true;
  };

  const renderAddressError = (errors, touched) => {
    if (addressFormOpened) {
      return null;
    }

    const addressTouched =
      touched.billingCompanyNumber ||
      touched.billingOrganization ||
      touched.billingStreet ||
      touched.billingPostalCode ||
      touched.billingRegion;

    const withErrors =
      !isEmpty(errors.billingCompanyNumber) ||
      !isEmpty(errors.billingOrganization) ||
      !isEmpty(errors.billingStreet) ||
      !isEmpty(errors.billingPostalCode) ||
      !isEmpty(errors.billingRegion);

    if (addressTouched && withErrors) {
      return (
        <div className={cn(s.yupError, "yup-error")}>
          <p>
            {translate("required").replace("${path}", translate("billingData"))}
          </p>
        </div>
      );
    }
  };

  const renderTermsAndConditions = () => {
    if (hideTermsAndConditions) {
      return null;
    }
    return (
      <div
        className={cn(
          "flex-container m-l-auto align-middle",
          s.termsAndConditions
        )}
      >
        <div className="flex-container flex-dir-column">
          <TTPCheckBoxField
            name="privacyTerms"
            value="1"
            label={
              <span className={s.acceptConditions}>
                {translate("privacy_p1")}
                &nbsp;
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  // href={`${appInfo.url}/${routes.privacyTerms.replace(
                  //   ":lang",
                  //   language
                  // )}`}
                >
                  {translate("privacy_p2")}
                </a>
              </span>
            }
            theme={theme}
            disabled={false}
          />
          <div className={cn(s.yupError, "yup-error")}>
            <ErrorMessage name="privacyTerms" component="p" />
          </div>
        </div>
        <div className="flex-container flex-dir-column">
          <TTPCheckBoxField
            name="termsOfSales"
            value="1"
            label={
              <span className={s.acceptConditions}>
                {translate("terms_p1")}&nbsp;
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  // href={`${appInfo.url}/${routes.terms.event.replace(
                  //   ":lang",
                  //   language
                  // )}`}
                >
                  {translate("terms_p2")}
                </a>
              </span>
            }
            disabled={false}
            theme={theme}
          />
          <div className={cn(s.yupError, "yup-error")}>
            <ErrorMessage name="termsOfSales" component="p" />
          </div>
        </div>
      </div>
    );
  };

  const renderFooterContent = ({ isValid }) => (
    <div className={cn(s.footerContent)}>
      {isMobile && renderTermsAndConditions()}
      <div>
        <div className={s.actions}>
          {isMobile && onboardingNavsMobile}
          {!isMobile && renderTermsAndConditions()}
          <NextStep
            text={
              (true || isLastStep) && !hideInvoicingData
                ? translate("payer")
                : translate("continue")
            }
            type={true || isLastStep ? "submit" : "button"}
            theme={theme}
            disabled={!isValid}
            language={language}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnMount
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        isValidating,
        resetForm,
        setValues,
        setFieldError,
        setFieldValue,
        isValid,
      }) => (
        <LocalLoaderWrapper
          className={cn(s.wrapper, "flex-container", "flex-1")}
          theme={theme}
          style={{ height: "100%" }}
        >
          <Form className={cn(s.wrapper, s[theme])}>
            <div className={cn(s.content, "flex-container")}>
              {!isSummaryStep && (
                <div className={cn(s.addAdress, "flex-1")}>
                  <div className={cn(s.addresses)}>
                    {!hideInvoicingData && (
                      <div>
                        <h3 style={{ marginBottom: "8px" }}>
                          {translate("billingAddress")} :
                        </h3>
                        <div className={s.invoicing}>
                          <GuestAddress
                            invoicings={invoicingAddresses}
                            setInvoicing={setInvoicingAddresses}
                            billingSignature={values.billingSignature}
                            defaultOpenForm={addressFormOpened}
                            onOpenForm={toggleAddressForm}
                            onSelectAddress={(address, reset) => {
                              handleClickInvoice(
                                address,
                                values,
                                errors,
                                touched,
                                resetForm,
                                setValues,
                                reset
                              );
                            }}
                            titleClassName={s.invoicingTitle}
                            title={
                              addressFormOpened
                                ? translate("newAddress")
                                : translate("existingAddresses")
                            }
                            horizontalInputs={false}
                            theme={theme}
                            token={token}
                            language={language}
                            env={env}
                            isPeppolActive={isPeppolActive}
                          />
                        </div>
                        <div style={{ marginLeft: "-0.5rem" }}>
                          {renderAddressError(errors, touched)}
                        </div>
                        <div>
                          <pre>{isSubmitting}</pre>
                          <pre>{isValidating}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {isLastStep && (
                <div className={s.summary}>
                  <BookPurchaseSummary
                    invoiceAddress={
                      !hideInvoicingData
                        ? pick(values, [
                            "billingCompanyNumber",
                            "billingOrganization",
                            "billingStreet",
                            "billingPostalCode",
                            "billingSubjectToVAT",
                            "billingSignature",
                            "billingRegion",
                          ])
                        : undefined
                    }
                    user={user}
                    product={product}
                    language={language}
                    fiduciaire={fiduciaire}
                  />
                </div>
              )}
            </div>
            <StepsControl className={s.actions}>
              {renderFooterContent({ isValid })}
            </StepsControl>
          </Form>
          <LocalLoader
            loading={isSubmitting || isValidating}
            style={{ zIndex: 100 }}
          />
        </LocalLoaderWrapper>
      )}
    </Formik>
  );
}

export default StepAddress;
