"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import Image from "next/image";

interface DigitalMoneyFormProps {
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  country: z.string().min(1, "Please select a country"),
  state: z.string().min(1, "Please select a state"),
  city: z.string().min(1, "Please select a city"),
  amount: z.enum(["5", "10", "15", "25", "50", "100"]),
  idPhoto: z
    .instanceof(File)
    .refine((file) => file.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only .jpg, .png, and .webp formats are supported."
    )
    .optional(),
  businessTIN: z
    .string()
    .regex(/^\d{15}$/, "Business TIN must be a 15-digit number"),
});

export default function DigitalMoneyForm({ onClose }: DigitalMoneyFormProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      country: "",
      state: "",
      city: "",
      amount: "5",
      idPhoto: undefined,
      businessTIN: "",
    },
  });

  type City = {
    id: string;
    name: string;
  };

  type State = {
    id: string;
    name: string;
  };

  type Country = {
    id: string;
    name: string;
  };

  const { watch } = form;
  const selectedCountry = watch("country");
  const selectedCountryID = countries?.filter(
    (c) => selectedCountry == c?.name
  );
  const selectedState = watch("state");

  const selectedStateID = states?.filter((c) => c.name == selectedState);
  const apiUrl = "https://tugza.tech";
  useEffect(() => {
    fetch(`${apiUrl}/api/locations`)
      .then((res) => res.json())
      .then((data) => setCountries(data.countries));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetch(`${apiUrl}/api/locations?countryId=${selectedCountryID[0].id}`)
        .then((res) => res.json())
        .then((data) => setStates(data.states));
      form.setValue("state", "");
      form.setValue("city", "");
    }
  }, [selectedCountry, form]);

  useEffect(() => {
    if (selectedState) {
      fetch(
        `${apiUrl}/api/locations?countryId=${selectedCountryID[0].id}&stateId=${selectedStateID[0].id}`
      )
        .then((res) => res.json())
        .then((data) => setCities(data.cities));
      form.setValue("city", "");
    }
  }, [selectedState, selectedCountry, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("idPhoto", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      });

      const response = await fetch("/api/digital-money", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const result = await response.json();
      toast.success("Digital money request submitted successfully!", {
        description: `Your unique number is: ${result.uniqueNumber}`,
      });
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Digital money request failed!", {
        description: "Failed to submit form. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6">
          Take Digital Money
        </h2>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Full Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries?.map((country, index) => (
                    <SelectItem key={index} value={country?.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {states?.map((state) => (
                    <SelectItem key={state?.id} value={state.name}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cities?.map((city) => (
                    <SelectItem key={city?.id} value={city?.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idPhoto"
          render={() => (
            <FormItem>
              <FormLabel>Passport or Digital ID Photo</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                  >
                    <Camera className="mr-2 h-4 w-4" /> Upload Photo
                  </Button>
                  {previewUrl && (
                    <Image
                      width={50}
                      height={50}
                      src={previewUrl || ""}
                      alt="ID Preview"
                      className="h-10 w-10 object-cover rounded"
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessTIN"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business TIN</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="15-digit Business TIN"
                  maxLength={15}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an amount" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[
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
                  ].map((amount) => (
                    <SelectItem key={amount} value={amount}>
                      {amount}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
