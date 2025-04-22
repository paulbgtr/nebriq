import { noteSchema } from "./schemas/note";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { tfidfResultSchema } from "./schemas/tfidf-result";
import { AddToWaitlist } from "@/shared/components/emails/add-to-waitlist";
import { LoginNotification } from "@/shared/components/emails/login-notification";
import { FeedbackEmail } from "@/shared/components/emails/feedback";
import { EmailTemplate } from "@/enums/email-template";
import { EmailData } from "@/types/email-data";
import { DeletionRequestAdmin } from "@/shared/components/emails/deletion-request-admin";
import { DeletionRequestUser } from "../components/emails/deletion-request-user";
import { PasswordReset } from "@/shared/components/emails/password-reset";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Extracts note connections from the given content string.
 */
export const extractNoteConnectionsFromContent = (
  content: string
): string[] | null => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  const mentionSpans = doc.querySelectorAll(
    'span.mention[data-type="mention"]'
  );

  const mentions: string[] = [];

  mentionSpans.forEach((span) => {
    const text = span.textContent;
    if (text) {
      mentions.push(text.substring(1));
    }
  });
  return mentions.length ? mentions : null;
};

/**
 * Formats a note's content HTML by removing all HTML tags and trimming the result.
 */
export const formatHTMLNoteContent = (content: string): string => {
  return content ? content.replace(/<[^>]*>/g, "").trim() : "";
};

/**
 * Extracts the first name from the given email address.
 *
 * Example: `extractFirstName('john.doe@example.com')` returns `'john'`.
 *
 * @param email - The email address from which to extract the first name.
 * @returns The first name.
 */
export const extractFirstName = (email: string): string => {
  const [firstName] = email.split("@")[0].split(".");
  return firstName;
};

/**
 * Formats the given file size in bytes into a human-readable string.
 *
 * @param bytes - The file size in bytes.
 * @returns The formatted file size string.
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Generates an email template based on the provided template type and data.
 *
 * This function dynamically selects and returns an email template component based on the given `template` and `data`.
 * It supports types of emails declared in the `EmailTemplate` enum.
 *
 * @param template - The type of email template to generate.
 * @param data - The data required to populate the email template.
 * @returns The generated email template component.
 */
export function getEmailTemplate<T extends EmailTemplate>(
  template: T,
  data: EmailData[T]
) {
  switch (template) {
    case EmailTemplate.WAITLIST:
      return AddToWaitlist({
        firstName: (data as EmailData[EmailTemplate.WAITLIST]).firstName,
      });
    case EmailTemplate.LOGIN_NOTIFICATION:
      const loginData = data as EmailData[EmailTemplate.LOGIN_NOTIFICATION];
      return LoginNotification({
        email: loginData.email,
        timestamp: loginData.timestamp,
        browserInfo: loginData.browserInfo,
      });
    case EmailTemplate.FEEDBACK:
      const feedbackData = data as EmailData[EmailTemplate.FEEDBACK];
      return FeedbackEmail({
        email: feedbackData.email,
        message: feedbackData.message,
        emoji: feedbackData.emoji,
      });
    case EmailTemplate.DELETION_REQUEST_ADMIN:
      const adminData = data as EmailData[EmailTemplate.DELETION_REQUEST_ADMIN];
      return DeletionRequestAdmin({
        userId: adminData.userId,
        userEmail: adminData.userEmail,
        reason: adminData.reason,
        details: adminData.details,
      });
    case EmailTemplate.DELETION_REQUEST_USER:
      const userData = data as EmailData[EmailTemplate.DELETION_REQUEST_USER];
      return DeletionRequestUser({
        reason: userData.reason,
      });
    case EmailTemplate.PASSWORD_RESET:
      const resetData = data as EmailData[EmailTemplate.PASSWORD_RESET];
      return PasswordReset({
        resetLink: resetData.resetLink,
      });
    default:
      throw new Error(`Unknown email template: ${template}`);
  }
}
