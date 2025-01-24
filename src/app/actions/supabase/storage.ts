"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { Bucket } from "@/types/bucket";
import { SupabaseClient } from "@supabase/supabase-js";
import sharp from "sharp";

/**
 * Creates a unique file name by adding a timestamp and a random string
 * to the original file name.
 *
 * @param name - The original file name.
 * @returns A unique file name.
 */
const createUniqueFileName = (name: string): string => {
  const fileExt = name.split(".").pop()?.toLowerCase();
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);

  return `${timestamp}_${randomString}.${fileExt}`;
};

/**
 * Gets a public URL for a file in the "images" bucket.
 *
 * @param supabase - The Supabase client instance.
 * @param path - The path of the file.
 * @returns The public URL of the file.
 */
const getPublicUrl = (
  supabase: SupabaseClient,
  path: string,
  bucket: Bucket
): string => {
  return supabase.storage.from(bucket).getPublicUrl(path, {}).data.publicUrl;
};

/**
 * Converts a file to a buffer.
 *
 * @param file - The file to convert.
 * @returns The buffer.
 */
const fileToBuffer = async (file: File): Promise<Buffer> => {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

/**
 * Optimizes an image by resizing and compressing it.
 *
 * @param buffer - The buffer of the image to optimize.
 * @param targetSizeInMB - The target size of the image in megabytes. Default is 1.
 * @param maxAttempts - The maximum number of attempts to optimize the image. Default is 5.
 * @returns The optimized buffer.
 */
const optimizeImage = async (
  buffer: Buffer,
  targetSizeInMB: number = 1,
  maxAttempts: number = 5
): Promise<Buffer> => {
  let quality = 80;
  let attempt = 0;
  let outputBuffer = buffer;

  while (attempt < maxAttempts) {
    outputBuffer = await sharp(buffer)
      .resize(800, 600, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality })
      .toBuffer();

    const sizeMB = outputBuffer.length / (1024 * 1024);

    if (sizeMB <= targetSizeInMB) {
      break;
    }

    // Reduce quality for next attempt
    quality -= 10;
    attempt++;
  }

  return outputBuffer;
};

export const upload = async (file: File, userId: string, bucket: Bucket) => {
  const supabase = await createClient();

  const originalName = file.name;
  const uniqueName = createUniqueFileName(originalName);
  const path = `${userId}/${uniqueName}`;

  let buffer = await fileToBuffer(file);

  if (bucket === "images") {
    buffer = await optimizeImage(buffer);
  }

  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    cacheControl: "3600",
    upsert: false,
    metadata: {
      originalName,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
  const url = getPublicUrl(supabase, path, bucket);

  return {
    url,
    originalName,
    uniqueName,
  };
};
