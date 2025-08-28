import { Event } from '@/common/types/event/interfaces';
import { RegistrationQuickSteps } from '@/common/types/guest/enums';

export type BookEventRegistrationData = {
  event: Event;
  registerNewGuest?: boolean;
  invitedGuestId?: number;
  redirectToSummary?: boolean;
  step?: RegistrationQuickSteps;
  selectOneClickPayment?: boolean;
};
