"use server";
import { z } from "zod";
import prisma from "./lib/db";
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

export async function generateDigitalCoin(data: z.infer<typeof formSchema>) {
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
      // For existing users, we only need to validate the phone number and generate a new coin
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
      // For new users, create a new record with all the provided information
      const coin = await prisma.digitalCoin.create({
        data: {
          name,
          country,
          city,
          state,
          amount,
          generatorPhoneNumber: phone,
          IdPhoto: idPhoto,
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
