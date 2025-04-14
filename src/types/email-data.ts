import { EmailTemplate } from "@/enums/email-template";

export type EmailData = {
  [EmailTemplate.WAITLIST]: {
    firstName: string;
  };
  [EmailTemplate.LOGIN_NOTIFICATION]: {
    email: string;
    timestamp: string;
    browserInfo: string;
  };
  [EmailTemplate.FEEDBACK]: {
    email: string;
    message: string;
    emoji?: string;
  };
  [EmailTemplate.DELETION_REQUEST_ADMIN]: {
    userId: string;
    userEmail: string;
    reason: string;
    details?: string;
  };
  [EmailTemplate.DELETION_REQUEST_USER]: {
    reason: string;
  };
  [EmailTemplate.PASSWORD_RESET]: {
    resetLink: string;
  };
};
