"use server";

import { AddToWaitlist } from "@/shared/components/emails/add-to-waitlist";
import { client } from "@/shared/lib/resend/client";
import { extractFirstName } from "@/shared/lib/utils";

export const sendEmail = async (subject: string, email: string) => {
  const firstName = extractFirstName(email);

  try {
    const { data, error } = await client.emails.send({
      from: "waitlist@nebriq.com",
      to: [email],
      subject,
      react: AddToWaitlist({ firstName }),
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
};
