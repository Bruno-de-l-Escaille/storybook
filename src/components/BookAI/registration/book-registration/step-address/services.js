import { isEmpty, parseBoolean } from "../../../../../utils";

export const createOption = (label) => ({
  label,
  value: label,
});
export const isEmptyAddress = (guest) =>
  isEmpty(guest.billingCompanyNumber) ||
  isEmpty(guest.billingOrganization) ||
  isEmpty(guest.billingStreet) ||
  isEmpty(guest.billingPostalCode);

export const prepareGuestAddress = (guest, addresses, uen) => {
  let addressData;

  if (uen?.length) {
    const address = addresses.filter(
      (a) => a.uen.toLocaleLowerCase() === uen.toLocaleLowerCase()
    );

    addressData = address.length
      ? {
          billingCompanyNumber: address[0].uen,
          billingOrganization: address[0].organization,
          billingStreet: address[0].street,
          billingPostalCode: `${address[0].zip} ${address[0].city}`.trim(),
          billingSubjectToVAT: address[0].vatApply === "1" ? "1" : "0",
          billingSignature: address[0].signature,
          billingAddress2: address[0].address2 ?? "",
          billingOrderNumber: address[0].orderNumber ?? "",
          billingCountry: address[0].country ?? "",
          billingDoNotSendInvoice: address[0].doNotSendInvoice ?? false,
        }
      : {
          billingCompanyNumber: uen,
          billingOrganization: "",
          billingStreet: "",
          billingPostalCode: "",
          billingSubjectToVAT: "0",
          billingSignature: "",
          billingAddress2: "",
          billingOrderNumber: "",
          billingCountry: "",
          billingDoNotSendInvoice: false,
        };

    return addressData;
  }

  const isAddressAvailable = addresses.some(
    (ad) => ad.signature === guest.billingSignature && !isEmpty(ad.signature)
  );

  const isEmptyGuestAddress = isEmptyAddress(guest);

  if (
    isEmpty(guest.billingSignature) &&
    isEmptyGuestAddress &&
    addresses.length > 0
  ) {
    /**
     * Apply the first adress by default when guest adress is empty
     */
    const address = addresses[0];

    addressData = {
      billingCompanyNumber: address.uen,
      billingOrganization: address.organization,
      billingStreet: address.street,
      billingPostalCode: `${address.zip} ${address.city}`.trim(),
      billingSubjectToVAT: address.vatApply === "1" ? "1" : "0",
      billingSignature: address.signature,
      billingAddress2: address.address2 ?? "",
      billingOrderNumber: address.orderNumber ?? "",
      billingCountry: address.country ?? "",
      billingDoNotSendInvoice: address.doNotSendInvoice ?? false,
    };
  } else if (addresses.length > 0 && !isAddressAvailable) {
    /**
     * If the selected address is not found, we clear data inorder to chose a new adress
     */
    addressData = {
      billingCompanyNumber: "",
      billingOrganization: "",
      billingStreet: "",
      billingPostalCode: "",
      billingSubjectToVAT: parseBoolean(guest.billingSubjectToVAT) ? "1" : "0",
      billingSignature: guest.billingSignature ?? "",
      billingAddress2: "",
      billingOrderNumber: "",
      billingCountry: "",
      billingDoNotSendInvoice: false,
    };
  } else {
    /**
     * If adress is Available OR If adressess[] is empty
     */
    addressData = {
      billingCompanyNumber: guest.billingCompanyNumber ?? "",
      billingOrganization: guest.billingOrganization ?? "",
      billingStreet: guest.billingStreet ?? "",
      billingPostalCode: guest.billingPostalCode ?? "",
      billingSubjectToVAT: parseBoolean(guest.billingSubjectToVAT) ? "1" : "0",
      billingSignature: guest.billingSignature ?? "",
      billingAddress2: guest.billingAddress2 ?? "",
      billingOrderNumber: guest.billingOrderNumber ?? "",
      billingCountry: guest.billingCountry ?? "",
      billingDoNotSendInvoice: parseBoolean(guest.billingDoNotSendInvoice),
    };
  }

  return addressData;
};

export const getInitialValues = (guest, addresses, coupons) => {
  if (!guest) {
    if (addresses.length > 0) {
      const address = addresses[0];

      return {
        billingCompanyNumber: address.uen,
        billingOrganization: address.organization,
        billingStreet: address.street,
        billingPostalCode: `${address.zip} ${address.city}`.trim(),
        billingSubjectToVAT: address.vatApply === "1" ? "1" : "0",
        billingSignature: address.signature,
        billingAddress2: address.address2 ?? "",
        billingOrderNumber: address.orderNumber ?? "",
        billingCountry: address.country ?? "",
        billingDoNotSendInvoice: address.doNotSendInvoice ?? false,
        privacyTerms: "0",
        termsOfSales: "0",
      };
    }
    return {
      billingCompanyNumber: "",
      billingOrganization: "",
      billingStreet: "",
      billingPostalCode: "",
      billingOrderNumber: "",
      billingAddress2: "",
      billingCountry: "",
      billingSubjectToVAT: "0",
      billingSignature: "",
      billingDoNotSendInvoice: false,
      privacyTerms: "0",
      termsOfSales: "0",
    };
  }

  const addressData = prepareGuestAddress(guest, addresses);
  const firstCoupon = coupons?.[0];
  const guestCoupon = coupons?.find((coupon) => coupon.code === guest.coupon);
  const frequency = guest.subscriptionFrequency;

  return {
    privacyTerms: "0",
    termsOfSales: guest.termsOfSales === 1 ? "1" : "0",
    ...addressData,
    coupons: guestCoupon
      ? [createOption(guestCoupon.code)]
      : firstCoupon
      ? [createOption(firstCoupon.code)]
      : [],
    frequency,
  };
};
export const getGuestAddressFromInvoiceAddress = (invoiceAddress) => ({
  billingCompanyNumber: invoiceAddress.uen,
  billingOrganization: invoiceAddress.organization,
  billingStreet: invoiceAddress.street,
  billingPostalCode: `${invoiceAddress.zip} ${invoiceAddress.city}`.trim(),
  billingSubjectToVAT: invoiceAddress.vatApply === "1" ? "1" : "0",
  billingSignature: invoiceAddress.signature,
  billingAddress2: invoiceAddress.address2 ?? "",
  billingOrderNumber: invoiceAddress.orderNumber ?? "",
  billingCountry: invoiceAddress.country ?? "",
  billingDoNotSendInvoice: parseBoolean(invoiceAddress.doNotSendInvoice),
});
