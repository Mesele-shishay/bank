"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createAccount } from "@/actions";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  accountType: z.enum(["savings"], {
    required_error: "Please select an account type",
  }),
  city_id: z.string().min(1, "Please select a city"),
  state: z.string().min(1, "Please select a state"),
  initialDeposit: z.number().min(100, "Initial deposit must be at least 100"),
  bank: z.string(),
  terms: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
});

type FormData = z.infer<typeof formSchema>;

interface State {
  id: number;
  name: string;
  country_id: number;
  iso: string;
}

interface City {
  id: number;
  state_id: number;
  name: string;
}

function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export function SignUpForm({ bank }: { bank?: string }) {
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      accountType: "savings",
      city_id: "",
      state: "",
      bank: bank || "",
      initialDeposit: 100,
      terms: false,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const watchState = watch("state");

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch("https://tugza.tech/api/states");
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (watchState) {
        try {
          const response = await fetch(
            `https://tugza.tech/api/city-state/${watchState}`
          );
          const data = await response.json();
          setCities(data);
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      }
    };
    fetchCities();
  }, [watchState]);

  const onSubmit = async (data: FormData) => {
    try {
      const result = await createAccount({ ...data, bank });

      if (result?.success) {
        form.reset();
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating account:", error);
      // Add network error handling logic here
    }
  };

  if (isLoading) {
    return <FormSkeleton />;
  }

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
            <Label htmlFor="state">State</Label>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.id} value={state.id.toString()}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.state && (
              <p className="text-sm text-red-500">{errors.state.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Controller
              name="city_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id.toString()}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.city_id && (
              <p className="text-sm text-red-500">{errors.city_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountType">Account Type</Label>
            <Controller
              name="accountType"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
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

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </div>
  );
}
