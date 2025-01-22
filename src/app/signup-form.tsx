"use client";

import { useState } from "react";
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
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  HomeIcon,
  CreditCardIcon,
} from "lucide-react";
import Link from "next/link";
import { createAccount } from "@/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? "Creating account..." : "Create account"}
    </Button>
  );
}

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useActionState(createAccount, null);

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

      <form className="space-y-4" action={formAction}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <Input
                id="name"
                name="name"
                placeholder="Enter full name"
                required
                className="pl-10"
              />
              <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
            {state?.error?.name && (
              <p className="text-sm text-red-500">{state.error.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email"
                required
                className="pl-10"
              />
              <MailIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
            {state?.error?.email && (
              <p className="text-sm text-red-500">{state.error.email[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter phone number"
                required
                className="pl-10"
              />
              <PhoneIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <Input
                id="address"
                name="address"
                placeholder="Enter address"
                required
                className="pl-10"
              />
              <HomeIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountType">Account Type</Label>
            <Select name="accountType" required>
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="savings">Savings</SelectItem>
                <SelectItem value="checking">Checking</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialDeposit">Initial Deposit</Label>
            <div className="relative">
              <Input
                id="initialDeposit"
                name="initialDeposit"
                type="number"
                placeholder="Enter initial deposit"
                required
                className="pl-10"
              />
              <CreditCardIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {state?.error?.password && (
              <p className="text-sm text-red-500">{state.error.password[0]}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="terms" name="terms" />
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
        {state?.error?.terms && (
          <p className="text-sm text-red-500">{state.error.terms[0]}</p>
        )}

        <SubmitButton />
      </form>
    </div>
  );
}
