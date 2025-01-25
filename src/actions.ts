"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import prisma from "./lib/db";
import { formSchema } from "./app/signup-form";

// User actions
const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  phone: z.string().optional(),
  city: z.string(),
  address: z.string().optional(),
});

export async function createUser(data: z.infer<typeof UserSchema>) {
  try {
    const validatedData = UserSchema.parse(data);
    const user = await prisma.user.create({ data: validatedData });
    revalidatePath("/users");
    return { success: true, user };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { success: false, error: "Failed to create user" };
  }
}

export async function updateUser(id: string, data: z.infer<typeof UserSchema>) {
  try {
    const validatedData = UserSchema.parse(data);
    const user = await prisma.user.update({
      where: { id },
      data: validatedData,
    });
    revalidatePath("/users");
    return { success: true, user };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { success: false, error: "Failed to update user" };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

export async function getUser(id: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return { success: true, user };
  } catch (error) {
    console.error("Failed to get user:", error);
    return { success: false, error: "Failed to get user" };
  }
}

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

// export async function updateAccount(
//   id: string,
//   data: z.infer<typeof AccountSchema>
// ) {
//   try {
//     const validatedData = AccountSchema.parse(data);
//     const account = await prisma.account.update({
//       where: { id },
//       data: validatedData,
//     });
//     revalidatePath("/accounts");
//     return { success: true, account };
//   } catch (error) {
//     console.error("Failed to update account:", error);
//     return { success: false, error: "Failed to update account" };
//   }
// }

export async function deleteAccount(id: string) {
  try {
    await prisma.account.delete({ where: { id } });
    revalidatePath("/accounts");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete account:", error);
    return { success: false, error: "Failed to delete account" };
  }
}

export async function getAccount(id: string) {
  try {
    const account = await prisma.account.findUnique({ where: { id } });
    return { success: true, account };
  } catch (error) {
    console.error("Failed to get account:", error);
    return { success: false, error: "Failed to get account" };
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
