"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import prisma from "./lib/db";

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

// Account actions
const AccountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  accountType: z.enum(["savings"], {
    required_error: "Please select an account type",
  }),
  initialDeposit: z
    .number()
    .min(100, "Initial deposit must be at least $100")
    .default(100),
});

export async function createAccount(data: z.infer<typeof AccountSchema>) {
  try {
    const validatedData = AccountSchema.parse(data);
    const account = await prisma.user.create({);
    revalidatePath("/accounts");
    return { success: true, account };
  } catch (error) {
    console.error("Failed to create account:", error);
    return { success: false, error: "Failed to create account" };
  }
}

export async function updateAccount(
  id: string,
  data: z.infer<typeof AccountSchema>
) {
  try {
    const validatedData = AccountSchema.parse(data);
    const account = await prisma.account.update({
      where: { id },
      data: validatedData,
    });
    revalidatePath("/accounts");
    return { success: true, account };
  } catch (error) {
    console.error("Failed to update account:", error);
    return { success: false, error: "Failed to update account" };
  }
}

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

// Book actions
const BookSchema = z.object({
  title: z.string(),
  details: z.string().optional(),
  userId: z.string(),
  city: z.string(),
});

export async function createBook(data: z.infer<typeof BookSchema>) {
  try {
    const validatedData = BookSchema.parse(data);
    const book = await prisma.book.create({ data: validatedData });
    revalidatePath("/books");
    return { success: true, book };
  } catch (error) {
    console.error("Failed to create book:", error);
    return { success: false, error: "Failed to create book" };
  }
}

export async function updateBook(id: string, data: z.infer<typeof BookSchema>) {
  try {
    const validatedData = BookSchema.parse(data);
    const book = await prisma.book.update({
      where: { id },
      data: validatedData,
    });
    revalidatePath("/books");
    return { success: true, book };
  } catch (error) {
    console.error("Failed to update book:", error);
    return { success: false, error: "Failed to update book" };
  }
}

export async function deleteBook(id: string) {
  try {
    await prisma.book.delete({ where: { id } });
    revalidatePath("/books");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete book:", error);
    return { success: false, error: "Failed to delete book" };
  }
}

export async function getBook(id: string) {
  try {
    const book = await prisma.book.findUnique({ where: { id } });
    return { success: true, book };
  } catch (error) {
    console.error("Failed to get book:", error);
    return { success: false, error: "Failed to get book" };
  }
}
