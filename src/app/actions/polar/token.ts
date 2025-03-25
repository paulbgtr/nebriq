"use server";

export const getPolarToken = async () => {
  try {
    const token = process.env.POLAR_TOKEN;

    if (!token) {
      throw new Error("POLAR_TOKEN is not set");
    }

    return token;
  } catch (error) {
    console.error("Failed to get POLAR_TOKEN:", error);
    throw error;
  }
};
