import BlFlag from "../assets/belgium-flag-icon.svg";
import FrFlag from "../assets/french-flag-icon.svg";
import LuFlag from "../assets/luxembourg-flag-icon.svg";
import NlFlag from "../assets/netherlands-flag-icon.svg";
import React from "react";

export const flagsOptions = [
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

export const countryUenOptions = {
  BE: {
    mask: "BE 9999.999.999",
    // regex: /^BE\d{10}$/,
  },
  LU: {
    mask: "LU99999999",
    // regex: /^LU\d{8}$/,
  },
  FR: {
    mask: "FR**999999999",
    // regex: /^FR[A-Z0-9]{2}\d{9}$/,
  },
  NL: {
    mask: "NL999999999B99",
    // regex: /^NL\d{9}B\d{2}$/,
  },
};
