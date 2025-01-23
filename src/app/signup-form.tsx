"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  HomeIcon,
  CreditCardIcon,
} from "lucide-react";
import Link from "next/link";
import { createAccount } from "@/actions";

const formSchema = z.object({
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
    .default(50),
  terms: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
});

type FormData = z.infer<typeof formSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? "Creating account..." : "Create account"}
    </Button>
  );
}

export function SignUpForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    await createAccount(data);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create a Bank Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your details below to open your account
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter full name"
                className="pl-10"
              />
              <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                {...register("email")}
                type="email"
                placeholder="Enter email"
                className="pl-10"
              />
              <MailIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Input
                id="phone"
                {...register("phone")}
                type="tel"
                placeholder="Enter phone number"
                className="pl-10"
              />
              <PhoneIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <Input
                id="address"
                {...register("address")}
                placeholder="Enter address"
                className="pl-10"
              />
              <HomeIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountType">Account Type</Label>
            <Controller
              name="accountType"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.accountType && (
              <p className="text-sm text-red-500">
                {errors.accountType.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialDeposit">Initial Deposit</Label>
            <div className="relative">
              <Input
                id="initialDeposit"
                {...register("initialDeposit", { valueAsNumber: true })}
                type="number"
                placeholder="Enter initial deposit"
                className="pl-10"
              />
              <CreditCardIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
            {errors.initialDeposit && (
              <p className="text-sm text-red-500">
                {errors.initialDeposit.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Controller
            name="terms"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="terms"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <label
            htmlFor="terms"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I accept the{" "}
            <Link href="#" className="text-primary hover:underline">
              Terms and Conditions
            </Link>
          </label>
        </div>
        {errors.terms && (
          <p className="text-sm text-red-500">{errors.terms.message}</p>
        )}

        <SubmitButton />
      </form>
    </div>
  );
}
