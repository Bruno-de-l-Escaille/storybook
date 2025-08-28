import { parseBoolean } from "@/common/services/misc/common";

export const getInvoicingDataOld = (source, guest, formValues) => {
  if (source === "FORM") {
    return {
      billingCompanyNumber: formValues?.billingCompanyNumber ?? "",
      billingOrganization: formValues?.billingOrganization ?? "",
      billingStreet: formValues?.billingStreet ?? "",
      billingPostalCode: formValues?.billingPostalCode ?? "",
      billingSubjectToVAT: parseBoolean(formValues?.billingSubjectToVAT),
      billingOrderNumber: formValues?.billingOrderNumber ?? "",
      billingAddress2: formValues?.billingAddress2 ?? "",
    };
  }

  return {
    billingCompanyNumber: guest.billingCompanyNumber ?? "",
    billingOrganization: guest.billingOrganization ?? "",
    billingStreet: guest.billingStreet ?? "",
    billingPostalCode: guest.billingPostalCode ?? "",
    billingSubjectToVAT: parseBoolean(guest.billingSubjectToVAT),
    billingOrderNumber: guest?.billingOrderNumber ?? "",
    billingAddress2: guest?.billingAddress2 ?? "",
  };
};

export const getInvoicingData = (data) => ({
  billingCompanyNumber: data?.billingCompanyNumber ?? "",
  billingOrganization: data?.billingOrganization ?? "",
  billingStreet: data?.billingStreet ?? "",
  billingPostalCode: data?.billingPostalCode ?? "",
  billingSubjectToVAT: parseBoolean(data?.billingSubjectToVAT),
  billingOrderNumber: data?.billingOrderNumber ?? "",
  billingAddress2: data?.billingAddress2 ?? "",
});
