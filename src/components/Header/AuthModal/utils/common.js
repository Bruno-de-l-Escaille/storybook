export function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function cleanEmail(email) {
  return email.replace("mailto:", "").trim();
}

export function formatPhone(number) {
  if (!number) {
    return "";
  }
  if (number.substr(0, 3) === "+32") {
    let base = number.substr(3);
    let subStr = base.substr(0, 2);

    if (["1", "5", "6", "7", "8"].includes(base.substr(0, 1))) {
      return (
        "+32 (0)" +
        subStr +
        " " +
        base.substr(2, 2) +
        " " +
        base.substr(4, 2) +
        " " +
        base.substr(6, 2)
      );
    }
    if (
      ["2", "3"].includes(base.substr(0, 1)) ||
      ["42", "43", "90", "92", "93", "94", "97", "98", "99"].includes(subStr)
    ) {
      return (
        "+32 (0)" +
        base.substr(0, 1) +
        " " +
        base.substr(1, 3) +
        " " +
        base.substr(4, 2) +
        " " +
        base.substr(6, 2)
      );
    }
    if (["46", "47", "48", "49"].includes(base.substr(0, 1))) {
      return (
        "+32 (0)" +
        base.substr(0, 3) +
        " " +
        base.substr(3, 2) +
        " " +
        base.substr(5, 2) +
        " " +
        base.substr(7, 2)
      );
    }
    if (base.substr(0, 3) === "800" || subStr === "90") {
      return (
        "+32 (0)" +
        base.substr(0, 3) +
        " " +
        base.substr(3, 2) +
        " " +
        base.substr(5, 3)
      );
    }
  } else if (number.substr(0, 3) === "+33") {
    let base = number.substr(3);
    return (
      "+33 (0)" +
      base.substr(0, 1) +
      " " +
      base.substr(1, 2) +
      " " +
      base.substr(3, 2) +
      " " +
      base.substr(5, 2) +
      " " +
      base.substr(7, 2)
    );
  }
  return number;
}
