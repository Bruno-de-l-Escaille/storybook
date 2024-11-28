export function validatePhone(number) {
  let phoneValidator = new PhoneValidator();
  return phoneValidator.validate(number);
}

/**
 * Contains rules for validating phone
 */
var PhoneValidator = function () {
  var Obj = {
    errorMsgs: {
      INVALID: "INVALID",
      NOT_ALLOWED: "NOT_ALLOWED",
      UNKNOWN: "UNKNOWN",
      NOT_USED: "NOT_USED",
    },

    getValidPhoneFormat: function (value, format) {
      var local = value;
      var international = value;

      if (!value) {
        return { valid: false };
      }

      if (typeof format === "undefined") {
        format = "local";
      }

      value = this.formatPhoneBeforeValidation(value);

      var number = this.getPreparedNumber(value);
      var result = this.validate(value);
      var base = this.getNumberWithoutCountryCode(number);

      if (result.valid) {
        if (this.isBeNumber(number)) {
          var code = "+32 (0)";
          var subStr = base.substr(0, 2);

          if (["1", "5", "6", "7", "8"].includes(base.substr(0, 1))) {
            international =
              code +
              subStr +
              " " +
              base.substr(2, 2) +
              " " +
              base.substr(4, 2) +
              " " +
              base.substr(6, 2);
          }
          if (
            ["2", "3"].includes(base.substr(0, 1)) ||
            ["42", "43", "90", "92", "93", "94", "97", "98", "99"].includes(
              subStr
            )
          ) {
            international =
              code +
              base.substr(0, 1) +
              " " +
              base.substr(1, 3) +
              " " +
              base.substr(4, 2) +
              " " +
              base.substr(6, 2);
          }
          if (["46", "47", "48", "49"].includes(subStr)) {
            international =
              code +
              base.substr(0, 3) +
              " " +
              base.substr(3, 2) +
              " " +
              base.substr(5, 2) +
              " " +
              base.substr(7, 2);
          }
          if (base.substr(0, 3) === "800" || subStr === "90") {
            international =
              code +
              base.substr(0, 3) +
              " " +
              base.substr(3, 2) +
              " " +
              base.substr(5, 3);
          }
        } else if (number.substr(0, 3) === "+33") {
          var code = "+33 (0)";
          international =
            code +
            base.substr(0, 1) +
            " " +
            base.substr(1, 2) +
            " " +
            base.substr(3, 2) +
            " " +
            base.substr(5, 2) +
            " " +
            base.substr(7, 2);
        }
      }

      if (typeof code !== "undefined") {
        local =
          code === "+33 (0)" ? international : international.replace(code, "0");
      }

      if (!result.valid) {
        result["base"] = base;

        return result;
      }

      result["number"] = format === "local" ? local : international;

      return result;
    },

    formatPhoneBeforeValidation: function (number) {
      number = number.toString().replace(/\s/g, "");

      if (
        !this.isBeNumber(number) &&
        !this.isFrNumber(number) &&
        "0" !== number[0]
      ) {
        number = "+32" + number.replace("+", "");
      }

      return number;
    },

    getPreparedNumber: function (number) {
      var preparedNumber = "";
      if (["0", "+", ""].includes(number[0])) {
        number = "+" + number;
      }

      var strNumbresPlus = "+0123456789";
      for (let i = 0; i < number.length; i++) {
        if (strNumbresPlus.indexOf(number[i]) !== -1) {
          preparedNumber += number[i];
        }
      }
      preparedNumber = this.removeOtherPlusOccurences(preparedNumber);

      if (preparedNumber.substr(0, 2) === "00") {
        preparedNumber = "+" + preparedNumber.substr(2);
      } else if (preparedNumber.substr(0, 1) === "0") {
        preparedNumber = "+32" + preparedNumber.substr(1);
      }
      return preparedNumber;
    },

    removeOtherPlusOccurences: function (number) {
      return number.substr(0, 1) + number.substr(1).replace("+", "");
    },

    isBeNumber: function (number) {
      return number.substr(0, 3) === "+32";
    },

    isFrNumber: function (number) {
      return number.substr(0, 3) === "+33";
    },

    getNumberWithoutCountryCode: function (number) {
      var result = number.substr(3);
      if (result.substr(0, 1) === 0) {
        // removing 0
        return result.substr(1);
      }
      return result;
    },

    isBeNotAllowedNumber: function (number) {
      var subStr = number.substr(0, 2);
      var notAllowedArray = [
        "17",
        "18",
        "62",
        "66",
        "72",
        "73",
        "74",
        "75",
        "76",
        "79",
        "91",
        "95",
        "96",
      ];

      if (number.substr(0, 3) === "801") {
        return true;
      }
      return notAllowedArray.includes(subStr);
    },

    isBeInvalidNumber: function (number) {
      return (
        number.length < 8 ||
        (["46", "47", "48", "49"].includes(number.substr(0, 2)) &&
          number.length < 9)
      );
    },

    isBeNotUsedNumber: function (number) {
      var subStr = number.substr(0, 2);
      var notUsedArray = ["20", "21", "29", "30", "31", "39"];

      return notUsedArray.includes(subStr);
    },

    isFrInvalidNumber: function (number) {
      return number.length !== 9;
    },

    validate: function (value) {
      value = this.formatPhoneBeforeValidation(value);

      var numberWithCountryCode = this.getPreparedNumber(value);
      var number = this.getNumberWithoutCountryCode(numberWithCountryCode);

      if (this.isBeNumber(numberWithCountryCode)) {
        if (this.isBeNotAllowedNumber(number)) {
          return { valid: false, message: this.errorMsgs.NOT_ALLOWED };
        }
        if (this.isBeInvalidNumber(number)) {
          return { valid: false, message: this.errorMsgs.INVALID };
        }
        if (this.isBeNotUsedNumber(number)) {
          return { valid: false, message: this.errorMsgs.NOT_USED };
        }
        if (number.substr(0, 1) === 0) {
          return { valid: false, message: this.errorMsgs.UNKNOWN };
        }
      } else if (this.isFrNumber(numberWithCountryCode)) {
        if (this.isFrInvalidNumber(number)) {
          return { valid: false, message: this.errorMsgs.INVALID };
        }
      } else {
        return { valid: false, message: this.errorMsgs.UNKNOWN };
      }

      return { valid: true, message: "" };
    },
  };

  return Obj;
};
