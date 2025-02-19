"use server";

import { client } from "@/shared/lib/resend/client";

export const sendEmail = async (
  subject: string,
  emailFrom: string,
  emailTo: string,
  template: React.ReactNode
) => {
  try {
    const { data, error } = await client.emails.send({
      from: emailFrom,
      to: [emailTo],
      subject,
      react: template,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
};
