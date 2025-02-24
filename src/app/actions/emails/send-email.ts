"use server";

import { client } from "@/shared/lib/resend/client";
import { getEmailTemplate } from "@/shared/lib/utils";
import { EmailTemplate } from "@/enums/email-template";
import { EmailData } from "@/types/email-data";

export const sendEmail = async <T extends EmailTemplate>(
  subject: string,
  emailFrom: string,
  emailTo: string,
  template: T,
  data: EmailData[T]
) => {
  try {
    const emailComponent = getEmailTemplate(template, data);

    const { data: responseData, error } = await client.emails.send({
      from: emailFrom,
      to: [emailTo],
      subject: subject,
      react: emailComponent,
    });

    if (error) {
      throw error;
    }

    return responseData;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
