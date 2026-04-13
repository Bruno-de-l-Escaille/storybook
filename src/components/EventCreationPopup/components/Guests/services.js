export const PAGE_SIZE_SELECT_STYLES = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "32px",
    height: "32px",
    borderRadius: "30px",
    border: "none",
    backgroundColor: "#f1f2f4",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: "#f1f2f4",
    },
    cursor: "pointer",
    paddingLeft: "15px",
    paddingRight: "15px",
    display: "flex",
    alignItems: "center",
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "32px",
    padding: "0",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  }),
  input: (provided) => ({
    ...provided,
    margin: "0",
    padding: "0",
    color: "#6d7f92",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: "32px",
    padding: "0",
    display: "flex",
    alignItems: "center",
    gap: "0",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "0",
    color: "#6d7f92",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#6d7f92",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: "0.24px",
    lineHeight: "normal",
    margin: "0",
    minWidth: "26px",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "8px",
    marginTop: "4px",
    boxShadow: "0 2px 8px 0 rgba(41, 57, 77, 0.15)",
    border: "1px solid #e1e4e8",
    overflow: "hidden",
  }),
  menuList: (provided) => ({
    ...provided,
    padding: "8px",
    borderRadius: "8px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#f3faff"
      : state.isFocused
      ? "#f9fafb"
      : "transparent",
    color: "#29394d",
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: state.isSelected ? 600 : 400,
    transition: "all 0.2s ease",
    "&:active": {
      backgroundColor: "#f3faff",
    },
  }),
};

export const STATUS_SELECT_STYLES = {
  control: (base, state) => ({
    ...base,
    minHeight: "32px",
    height: "32px",
    borderColor: state.menuIsOpen ? "#29394d" : "#b2bcc6",
    borderWidth: "0.5px",
    borderRadius: "8px",
    boxShadow: "none",
    cursor: "pointer",
    "&:hover": {
      borderColor: state.menuIsOpen ? "#29394d" : "#b2bcc6",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    height: "32px",
    padding: "0 10px",
  }),
  input: (base) => ({
    ...base,
    margin: "0",
    padding: "0",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: "32px",
  }),
  menu: (base) => ({
    ...base,
    marginTop: "4px",
    borderRadius: "8px",
    border: "0.5px solid #e1e4e8",
    boxShadow: "0 4px 12px rgba(41, 57, 77, 0.1)",
  }),
  menuList: (base) => ({
    ...base,
    padding: "4px",
    borderRadius: "8px",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isDisabled
      ? "white"
      : state.isSelected
      ? "#f3faff"
      : state.isFocused
      ? "#f4f7f9"
      : "white",
    color: state.isDisabled ? "#b2bcc6" : "#29394d",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    padding: "8px 10px",
    borderRadius: "6px",
    margin: "2px 0",
    fontSize: "12px",
    fontWeight: 600,
    opacity: state.isDisabled ? 0.6 : 1,
    "&:active": {
      backgroundColor: state.isDisabled ? "white" : "#f3faff",
    },
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: "12px",
    fontWeight: 600,
    margin: 0,
  }),
};
