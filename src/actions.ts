"use server";

import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  accountType: z.enum(["savings", "checking", "business"]),
  initialDeposit: z
    .number()
    .min(0, "Initial deposit must be a positive number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  terms: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
});

export async function createAccount(formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    accountType: formData.get("accountType"),
    initialDeposit: Number.parseFloat(formData.get("initialDeposit") as string),
    password: formData.get("password"),
    terms: formData.get("terms") === "on",
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Here you would typically create the user account
  // For demo purposes, we'll just return success
  return { success: true };
}

export async function exportUserData(city: string) {
  // Simulate exporting user data
  console.log(`Exporting user data for ${city}`);

  // In a real application, you would fetch the data from a database
  // and generate an Excel or CSV file here

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // For demo purposes, we'll just log a success message
  console.log(`Data export for ${city} completed`);
}
