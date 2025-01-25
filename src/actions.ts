"use server";
import { z } from "zod";
import prisma from "./lib/db";
import { formSchema } from "./app/signup-form";

type AccountSchema = z.infer<typeof formSchema>;

export async function createAccount(data: AccountSchema) {
  try {
    const validatedData = data;
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: validatedData.email,
        phone: validatedData.phone,
        city: validatedData.city_id,
        address: validatedData.address,
        book: validatedData.bank || "",
      },
    });
    const account = await prisma.account.create({
      data: {
        accountType: validatedData.accountType || "savings",
        userId: user.id,
      },
    });
    return { success: true };
    console.log(account);
  } catch (error) {
    console.error("Failed to create account:", error);
    return { success: false, error: "Failed to create account" };
  }
}

export async function exportUserData({
  selectedCity,
  bank,
}: {
  selectedCity: string;
  bank: string;
}) {
  try {
    const userData = await prisma.user.findMany({
      where: {
        city: selectedCity,
        book: bank,
      },
    });

    return {
      success: true,
      userData: userData,
    };
  } catch (error) {
    console.error("Failed to export user data:", error);
    return { success: false, error: "Failed to export user data" };
  }
}
