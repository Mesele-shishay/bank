"use server";

import { z } from "zod";
import { PrismaClient } from "@prisma/client";

// Ensure this import is correct for your project structure
const prisma = new PrismaClient();

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  country: z.string().min(1, "Please select a country"),
  state: z.string().min(1, "Please select a state"),
  city: z.string().min(1, "Please select a city"),
  amount: z.enum([
    "50",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
    "1000",
  ]),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  idPhoto: z.string().optional(),
  businessTIN: z
    .string()
    .regex(/^\d{8,15}$/, "Business TIN must be between 8 and 15 digits"),
  isExistingUser: z.boolean().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

interface AccountCreationResult {
  success: boolean;
  error?: string;
}

interface UserExportResult {
  success: boolean;
  userData?: any[]; // Replace 'any' with a more specific type if possible
  error?: string;
}

interface DigitalCoinResult {
  success: boolean;
  coin?: string;
  coinToken?: string;
  error?: string;
}

export async function createAccount(
  data: FormSchema
): Promise<AccountCreationResult> {
  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        city: data.city,
        // Removed email and address as they're not in the FormSchema
        book: "", // Set a default value or remove if not needed
      },
    });

    await prisma.account.create({
      data: {
        accountType: "savings", // Set a default value
        userId: user.id,
      },
    });

    return { success: true };
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
}): Promise<UserExportResult> {
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

export async function generateDigitalCoin(
  data: FormSchema
): Promise<DigitalCoinResult> {
  try {
    const {
      name,
      country,
      city,
      state,
      amount,
      phone,
      idPhoto,
      isExistingUser,
    } = data;
    const coinToken = Math.floor(
      100000000000000 + Math.random() * 900000000000000
    ).toString();

    if (isExistingUser) {
      const existingUser = await prisma.digitalCoin.findFirst({
        where: { generatorPhoneNumber: phone },
      });

      if (!existingUser) {
        return { success: false, error: "User not found" };
      }

      const coin = await prisma.digitalCoin.create({
        data: {
          name: existingUser.name,
          country: existingUser.country,
          city: existingUser.city,
          state: existingUser.state,
          amount,
          generatorPhoneNumber: phone,
          IdPhoto: existingUser.IdPhoto,
          coinToken,
        },
      });

      return { success: true, coin: coin.amount, coinToken: coin.coinToken };
    } else {
      const coin = await prisma.digitalCoin.create({
        data: {
          name,
          country,
          city,
          state,
          amount,
          generatorPhoneNumber: phone,
          IdPhoto: idPhoto || "",
          coinToken,
        },
      });

      return { success: true, coin: coin.amount, coinToken: coin.coinToken };
    }
  } catch (error) {
    console.error("Error generating digital coin:", error);
    return { success: false, error: "Failed to generate digital coin" };
  }
}
