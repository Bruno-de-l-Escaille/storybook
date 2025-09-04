export const ReductionType = {
  EVENT_REGISTRATION: "cycleEventRegistration",
};

export const CreditNoteStatus = {
  NOT_REFUNDED: "NOT_REFUNDED",
  REFUNDED: "REFUNDED",
};

export const OrderStatus = {
  OVER_PAID: "OVER_PAID",
  PAID: "PAID",
  NOT_PAID: "NOT_PAID",
  UNDER_PAID: "UNDER_PAID",
};

export const OrderOperationType = {
  BANK_TRANSFER: "BANK_TRANSFER",
  MANUAL: "MANUAL",
  OGONE: "OGONE",
  PAYPAL: "PAYPAL",
  MANGO_PAY: "MANGO_PAY",
  PAY_CONIQ: "PAY_CONIQ",
};

export const RegistrationFullSteps = {
  PERSONAL_DATA: 0,
  PLAN: 1,
  OPTIONS: 2,
  ADDRESS: 3,
  SUMMARY: 4,
  PAYMENT: 5,
  END: 6,
};

export const RegistrationQuickSteps = {
  PERSONAL_DATA: 0,
  PLAN: 1,
  OPTIONS: 2,
  ADDRESS: 3,
  SUMMARY: 4,
  PAYMENT: 5,
  END: 6,
};

export const CouponReductionType = {
  EVENT: "event",
  PLAN: "plan",
  OPTION: "option",
  CYCLE: "cycle",
};

export const EventFullAllowedCoupons = [
  CouponReductionType.EVENT,
  CouponReductionType.PLAN,
  CouponReductionType.OPTION,
];

export const EventQuickAllowedCoupons = [CouponReductionType.EVENT];
export const CycleAllowedCoupons = [CouponReductionType.CYCLE];

export const RegistrationSteps = {
  PERSONAL_DATA: 1,
  CHOICES: 2,
  PAYMENT: 4,
  END: 5,
};

export const PremiumRegistrationStatus = {
  NONE: 0,
  PENDING: 1,
  ACTIVE: 2,
  GRACE_PERIOD: 3,
  CANCELED: 4,
};

export const SubscriptionFrequency = {
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
};

export const FORCED_REGISTRATION_TYPE = "FORCED";

export const PaymentStatus = {
  SUCCEEDED: "SUCCEEDED",
  FAILED: "FAILED",
  PENDING: "CREATED",
};

export const PostPaymentStatus = {
  POSTED: 0,
  TO_POST: 1,
  FAILED: 2,
};
