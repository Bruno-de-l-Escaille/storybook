import { Autocomplete, LoadScript } from "@react-google-maps/api";
import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { ReactComponent as BlFlag } from "../assets/belgium-flag-icon.svg";
import { ReactComponent as FrFlag } from "../assets/french-flag-icon.svg";
import { ReactComponent as LuFlag } from "../assets/luxembourg-flag-icon.svg";
import { ReactComponent as NlFlag } from "../assets/netherlands-flag-icon.svg";
import styles from "../guest-address.module.scss";
import s from "./add-address.module.scss";
import { countryUenOptions } from "./constans";
import { TTPSelectField } from "../../../../ttp-form/TTPSelect";
import { TTPInput } from "../../../../ttp-form/TTPInput";
import TTPRadioGroup from "../../../../ttp-form/TTPRadioGroup";
import {
  formatUen,
  getApiUrl,
  isEmpty,
  parseBoolean,
} from "../../../../../../utils";
import { LocalLoader } from "../../../../local-loader";
import { LocalLoaderWrapper } from "../../../../local-loader/local-loader";
import { validateOrganizationNumber } from "../../../../../../api/adress";
import { I18N } from "../../../../../../i18n";

export function AddAddress({
  theme = "blue",
  horizontalInputs = true,
  defaultUen,
  onSubmit,
  onCancel,
  token,
  lng = "fr",
  env,
}) {
  const translate = (text) => {
    return I18N[lng][text];
  };

  const [saving, setSaving] = useState(false);
  const [inputMask, setInputMask] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const userInputRef = useRef("");
  const [data, setData] = useState({
    billingCompanyNumber: formatUen(defaultUen?.toUpperCase()) ?? "",
    billingOrganization: "",
    billingStreet: "",
    billingPostalCode: "",
    billingSubjectToVAT: "1",
    billingAddress2: "",
    billingOrderNumber: "",
    billingCountry: "",
  });
  const GOOGLE_MAP_API_KEY = "AIzaSyAiOtVCQorixsHMcyagZDJVDGhdbbfANl4";

  const flagsOptions = [
    {
      value: "BE",
      label: <BlFlag width="20" height="16" style={{ zIndex: 10 }} />,
    },
    {
      value: "FR",
      label: <FrFlag width="20" height="16" style={{ zIndex: 10 }} />,
    },
    {
      value: "LU",
      label: <LuFlag width="20" height="16" style={{ zIndex: 10 }} />,
    },
    {
      value: "NL",
      label: <NlFlag width="20" height="16" style={{ zIndex: 10 }} />,
    },
  ];
  const [selectedFlag, setSelectedFlag] = useState(flagsOptions[0]);
  const streetAutocompleteRef = useRef(null);
  const pcAutocompleteRef = useRef(null);
  // const {
  //   preferences: { language: lng },
  // } = usePreferences();
  const containsNumber = (inputString) => {
    const hasNumber = /\d/.test(inputString);
    return hasNumber;
  };

  useEffect(() => {
    const uenInput = document.querySelector(`#input-billingCompanyNumber`);

    if (!isEmpty(defaultUen) && uenInput) {
      uenInput.focus();
      uenInput.blur();
    }
  }, [defaultUen]);

  useEffect(() => {
    setData((data) => ({
      ...data,
      billingStreet: "",
      billingPostalCode: "",
    }));
  }, [selectedFlag]);

  const [errors, setErrors] = useState({
    billingCompanyNumber: "",
    billingOrganization: "",
    billingStreet: "",
    billingPostalCode: "",
    billingSubjectToVAT: "0",
    billingAddress2: "",
    billingOrderNumber: "",
    billingCountry: "",
  });

  const validateCompanyNumber = async (
    companyNumber,
    subjectToVAT,
    autoComplete
  ) => {
    setIsFetching(true);
    if (!companyNumber) {
      setIsFetching(false);
      return !parseBoolean(subjectToVAT);
    }

    if (/^\d{10}$/.test(companyNumber ?? "")) {
      companyNumber = `BE${companyNumber}`;
      setInputMask("aa 9999.999.999");
    }

    if (/^[\d.\s]{8}$/.test(companyNumber ?? "")) {
      companyNumber = `LU${companyNumber}`;
      setInputMask("aa99999999");
    }

    let isValid = false;

    await validateOrganizationNumber(token, getApiUrl(env), companyNumber)
      .then((res) => {
        const organzationInfo = res.data;
        const address = organzationInfo.address.split("\n");
        if (organzationInfo) {
          isValid =
            organzationInfo.isValid || organzationInfo.isValidBelgiumAlgorithm;
          if (
            organzationInfo.name !== "---" ||
            organzationInfo.address !== "---"
          ) {
            if (autoComplete) {
              setData((data) => ({
                ...data,
                billingCompanyNumber: companyNumber ?? "",
                billingOrganization: organzationInfo.name
                  .toLowerCase()
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" "),
                billingStreet: address[0] ?? organzationInfo.address,
                billingPostalCode: address[1] ?? "",
                billingSubjectToVAT: "1",
              }));
            }
          }
        }
        if (autoComplete) {
          setData((data) => ({
            ...data,
            billingCompanyNumber: companyNumber ?? "",
          }));
        }
      })
      .catch(() => {
        setIsFetching(false);
        if (autoComplete) {
          setData((data) => ({
            ...data,
            billingOrganization: "",
            billingStreet: "",
            billingPostalCode: "",
          }));
        }
        isValid = false;
      });

    setIsFetching(false);
    return isValid;
  };

  const validationSchema = yup.object().shape({
    billingCompanyNumber: yup
      .string()
      .label(translate("billingCompanyNumber"))
      .when("billingSubjectToVAT", {
        is: (billingSubjectToVAT) => parseBoolean(billingSubjectToVAT),
        then: () =>
          yup
            .string()
            .required(translate("required"))
            .label(translate("billingCompanyNumber"))
            .test(
              "billingCompanyNumber",
              translate("invalid"),
              async (value, context) =>
                validateCompanyNumber(
                  value,
                  true,
                  context.options.context?.autoComplete
                )
            ),
        otherwise: () =>
          yup
            .string()
            .label(translate("billingCompanyNumber"))
            .test(
              "billingCompanyNumber",
              translate("invalid"),
              async (value, context) =>
                validateCompanyNumber(
                  value,
                  false,
                  context.options.context?.autoComplete
                )
            ),
      }),
    billingOrganization: yup
      .string()
      .label(translate("billingOrganization"))
      .required(translate("required")),
    billingStreet: yup
      .string()
      .label(translate("billingStreet"))
      .required(translate("required"))
      .test(
        "billingStreet",
        translate("streetNumberMissing"),
        (value, context) =>
          containsNumber(value) || context.options.context?.skip
      ),

    billingAddress2: yup.string().label(translate("billingAddress2")),

    billingOrderNumber: yup.string().label(translate("billingOrderNumber")),

    billingPostalCode: yup
      .string()
      .label(translate("billingPostalCode")) // Ex: '1360 Perwez',
      .required(translate("required"))
      .test("billingPostalCode", translate("missing_postal_code"), (value) =>
        /\d{4,9}/.test(value)
      )
      .test("billingPostalCode", translate("missing_locality"), (value) =>
        /[a-zA-Z]/.test(value)
      ),
    billingSubjectToVAT: yup
      .string()
      .oneOf(["1", "0"])
      .label(translate("soumis_tva"))
      .required(translate("required")),
    billingCountry: yup.string(),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await validationSchema.validate(data, {
        abortEarly: false,
        context: { autocomplete: false, skip: true },
      });

      setSaving(true);
      data.billingCompanyNumber = data.billingCompanyNumber.replace(
        /[. ]/g,
        ""
      );
      onSubmit({ ...data, billingCountry: selectedFlag.value }, () =>
        setSaving(false)
      );
    } catch (err) {
      const mapErrors = err.inner.map(({ path, message }) => ({
        path,
        message,
      }));

      setErrors((errors) => {
        const newErrors = { ...errors };
        mapErrors.forEach((e) => {
          newErrors[e.path] = e.message;
        });

        return newErrors;
      });
    }
  };

  const handleChange = ({ target: { value, name } }) => {
    const fieldName = name;

    if (!isEmpty(errors[fieldName])) {
      setErrors((errors) => ({ ...errors, [fieldName]: "" }));
    }

    if (fieldName === "billingCompanyNumber") {
      const countryCode = value.substr(0, 2);
      if (countryUenOptions[countryCode]) {
        setInputMask(countryUenOptions[countryCode].mask);
      }
    }

    setData((data) => ({ ...data, [fieldName]: value }));
  };

  const handleUserInput = (value) => {
    userInputRef.current = value;
    if (
      (value?.length === 12 && value?.includes("BE")) ||
      (value?.length === 10 && value?.includes("LU"))
    ) {
      if (value !== data.billingCompanyNumber)
        setData((data) => ({
          ...data,
          billingCompanyNumber: value,
        }));
    }
  };

  const beforeMaskedValueChange = (states) => {
    const { nextState, currentState } = states;
    let { value } = nextState;
    const { selection } = nextState;
    const { value: userInputValue } = currentState ?? {};

    if (
      userInputValue?.substr(0, 2) === "BE" &&
      inputMask !== "aa 9999.999.999"
    ) {
      setInputMask("aa 9999.999.999");
      value = userInputValue;
    }

    if (userInputValue?.substr(0, 1) === "LU" && inputMask !== "aa99999999") {
      setInputMask("aa99999999");
      value = userInputValue;
    }

    handleUserInput(userInputValue);

    return { value, selection };
  };

  const validateField = (name, options) => {
    validationSchema
      .validateAt(name, data, options)
      .then(() => {
        if (!isEmpty(errors[name])) {
          setErrors((errors) => ({ ...errors, [name]: "" }));
        }
      })
      .catch(({ message }) => {
        setErrors((errors) => ({ ...errors, [name]: message }));
      })
      .finally(() => setIsFetching(false));
  };

  const onFieldBlur = ({ target: { name } }) => {
    setIsFetching(true);
    const fieldName = name;

    validateField(fieldName, { context: { autoComplete: true } });
  };

  const handleFlagsSelectChange = (value) => {
    setSelectedFlag(value);
  };

  const handlePlaceSelect = (fieldName) => {
    if (fieldName === "billingStreet") {
      const place = streetAutocompleteRef.current?.getPlace();
      if (place) {
        const street = place.address_components?.find((component) =>
          component.types.includes("route")
        );
        const streetNumber = place.address_components?.find((component) =>
          component.types.includes("street_number")
        );
        const postalCode = place.address_components?.find((component) =>
          component.types.includes("postal_code")
        );
        const locality = place.address_components?.find((component) =>
          component.types.includes("locality")
        );
        if (street && streetNumber) {
          setData((data) => ({
            ...data,
            billingStreet: `${streetNumber.long_name}, ${street.long_name}`,
          }));
        } else {
          setData((data) => ({
            ...data,
            billingStreet: place.name ?? "",
          }));
        }
        if (postalCode && locality) {
          setData((data) => ({
            ...data,
            billingPostalCode: `${postalCode.long_name} ${locality.long_name}`,
          }));
        } else {
          setData((data) => ({
            ...data,
            billingPostalCode: "",
          }));
        }
      }
    } else if (fieldName === "billingPostalCode") {
      const place = pcAutocompleteRef.current?.getPlace();
      if (place) {
        const postalCode = place.address_components?.find((component) =>
          component.types.includes("postal_code")
        );
        const locality = place.address_components?.find((component) =>
          component.types.includes("locality")
        );
        if (postalCode && locality) {
          setData((data) => ({
            ...data,
            billingPostalCode: `${postalCode.long_name} ${locality.long_name}`,
          }));
        } else {
          setData((data) => ({
            ...data,
            billingPostalCode: place.name ?? "",
          }));
        }
      }
    }
  };

  return (
    <div
      className={cn("m-b-s", s.wrapper, s[theme])}
      style={{ position: "relative" }}
    >
      <LocalLoaderWrapper theme={theme}>
        {/* billingCompanyNumber */}
        <TTPInput
          theme={theme}
          name="billingCompanyNumber"
          label={translate("billingCompanyNumber")}
          required={parseBoolean(data.billingSubjectToVAT) ?? true}
          isHorizontal={horizontalInputs}
          labelClassName={styles.inputLabel}
          onChange={handleChange}
          onBlur={onFieldBlur}
          value={data.billingCompanyNumber}
          hasError={!isEmpty(errors.billingCompanyNumber)}
          mask={inputMask}
          isInputMask
          beforeMaskStateChange={beforeMaskedValueChange}
          placeholder="BE XXXX.XXX.XXX | LUXXXXXXXX"
          disabled={isFetching}
          wrapperClassName={cn(
            horizontalInputs ? s.inputsContainer : s.inputsContainerVertical,
            s[theme]
          )}
        >
          {!isEmpty(errors.billingCompanyNumber) && (
            <p>{errors.billingCompanyNumber}</p>
          )}
        </TTPInput>
        {/* billingOrganization */}
        <TTPInput
          theme={theme}
          name="billingOrganization"
          label={translate("billingOrganization")}
          required
          isHorizontal={horizontalInputs}
          labelClassName={styles.inputLabel}
          onChange={handleChange}
          onBlur={onFieldBlur}
          value={data.billingOrganization}
          hasError={!isEmpty(errors.billingOrganization)}
          beforeMaskStateChange={beforeMaskedValueChange}
          disabled={isFetching}
          wrapperClassName={cn(
            horizontalInputs ? s.inputsContainer : s.inputsContainerVertical,
            s[theme]
          )}
        >
          {!isEmpty(errors.billingOrganization) && (
            <p>{errors.billingOrganization}</p>
          )}
        </TTPInput>
        {/* billingStreet */}
        <div
          className={
            horizontalInputs ? s.streetContainer : s.streetContainerVertical
          }
        >
          <TTPSelectField
            options={flagsOptions}
            name="billingCountry"
            wrapperClassName={
              horizontalInputs ? s.flagsSelect : s.flagsSelectVertical
            }
            onChange={handleFlagsSelectChange}
            value={selectedFlag.value}
            theme={theme}
            selected={!isEmpty(data.billingStreet)}
            hasError={!isEmpty(errors.billingStreet)}
          />
          <LoadScript
            googleMapsApiKey={GOOGLE_MAP_API_KEY}
            libraries={["places"]}
            language={lng}
          >
            <Autocomplete
              onLoad={(autocomplete) => {
                streetAutocompleteRef.current = autocomplete;
              }}
              onPlaceChanged={() => handlePlaceSelect("billingStreet")}
              options={{
                componentRestrictions: { country: selectedFlag.value },
              }}
            >
              <TTPInput
                key="billingStreet"
                theme={theme}
                name="billingStreet"
                label={translate("billingStreet")}
                required
                isHorizontal={horizontalInputs}
                labelClassName={styles.inputLabel}
                onChange={handleChange}
                onBlur={onFieldBlur}
                value={data.billingStreet}
                hasError={
                  !isEmpty(errors.billingStreet) &&
                  errors.billingStreet !== translate("streetNumberMissing")
                }
                hasWarning={
                  !isEmpty(errors.billingStreet) &&
                  errors.billingStreet === translate("streetNumberMissing")
                }
                beforeMaskStateChange={beforeMaskedValueChange}
                placeholder={translate("billingStreetPlaceholder")}
                disabled={isFetching}
                wrapperClassName={cn(
                  horizontalInputs
                    ? s.streetInputContainer
                    : s.streetInputContainerVertical,
                  s[theme]
                )}
              >
                {!isEmpty(errors.billingStreet) && (
                  <p
                    className="m-b-xs"
                    style={
                      errors.billingStreet === translate("streetNumberMissing")
                        ? { color: "rgb(223 146 41)" }
                        : {}
                    }
                  >
                    {errors.billingStreet}
                  </p>
                )}
              </TTPInput>
            </Autocomplete>
          </LoadScript>
        </div>
        {/* billingPostalCode */}
        <div>
          <LoadScript
            googleMapsApiKey={GOOGLE_MAP_API_KEY}
            libraries={["places"]}
            language={lng}
          >
            <Autocomplete
              onLoad={(autocomplete) => {
                pcAutocompleteRef.current = autocomplete;
              }}
              onPlaceChanged={() => handlePlaceSelect("billingPostalCode")}
              options={{
                componentRestrictions: { country: selectedFlag.value },
              }}
            >
              <TTPInput
                key="billingPostalCode"
                theme={theme}
                name="billingPostalCode"
                label={translate("billingPostalCode")}
                required
                isHorizontal={horizontalInputs}
                labelClassName={styles.inputLabel}
                onChange={handleChange}
                onBlur={onFieldBlur}
                value={data.billingPostalCode}
                hasError={!isEmpty(errors.billingPostalCode)}
                beforeMaskStateChange={beforeMaskedValueChange}
                placeholder={translate("billingPostalCodePlaceholder")}
                disabled={isFetching}
                wrapperClassName={cn(
                  horizontalInputs
                    ? s.inputsContainer
                    : s.inputsContainerVertical,
                  s[theme]
                )}
              >
                {!isEmpty(errors.billingPostalCode) && (
                  <p>{errors.billingPostalCode}</p>
                )}
              </TTPInput>
            </Autocomplete>
          </LoadScript>
        </div>
        {/* billingAddress2 */}
        <TTPInput
          key="billingAddress2"
          theme={theme}
          name="billingAddress2"
          label={translate("billingAddress2")}
          isHorizontal={horizontalInputs}
          labelClassName={styles.inputLabel}
          onChange={handleChange}
          onBlur={onFieldBlur}
          value={data.billingAddress2}
          hasError={!isEmpty(errors.billingAddress2)}
          beforeMaskStateChange={beforeMaskedValueChange}
          disabled={isFetching}
          wrapperClassName={cn(
            horizontalInputs ? s.inputsContainer : s.inputsContainerVertical,
            s[theme]
          )}
        >
          {!isEmpty(errors.billingAddress2) && <p>{errors.billingAddress2}</p>}
        </TTPInput>
        {/* billingOrderNumber */}
        <TTPInput
          key="billingOrderNumber"
          theme={theme}
          name="billingOrderNumber"
          label={translate("billingOrderNumber")}
          isHorizontal={horizontalInputs}
          labelClassName={styles.inputLabel}
          onChange={handleChange}
          onBlur={onFieldBlur}
          value={data.billingOrderNumber}
          hasError={!isEmpty(errors.billingOrderNumber)}
          beforeMaskStateChange={beforeMaskedValueChange}
          disabled={isFetching}
          wrapperClassName={cn(
            horizontalInputs ? s.inputsContainer : s.inputsContainerVertical,
            s[theme]
          )}
        >
          {!isEmpty(errors.billingOrderNumber) && (
            <p>{errors.billingOrderNumber}</p>
          )}
        </TTPInput>
        {/* billingSubjectToVAT */}
        <TTPRadioGroup
          theme={theme}
          name="billingSubjectToVAT"
          required
          labelClassName={styles.inputLabel}
          // onChange={handleChange}
          onClick={(event) => handleChange(event)}
          onBlur={onFieldBlur}
          options={[
            {
              value: "1",
              label: translate("soumis_tva"),
            },
            {
              value: "0",
              label: translate("non_soumis_tva"),
            },
          ]}
          value={data.billingSubjectToVAT}
        />
        <div className={cn(s.actions)}>
          <button
            className={s.cancel}
            onClick={(e) => {
              e.preventDefault();
              onCancel();
            }}
          >
            {translate("cancel")}
          </button>
          <button className={s.submit} onClick={handleSubmit}>
            {translate("add")}
          </button>
        </div>
        <LocalLoader loading={isFetching} />
      </LocalLoaderWrapper>
    </div>
  );
}

export default AddAddress;
