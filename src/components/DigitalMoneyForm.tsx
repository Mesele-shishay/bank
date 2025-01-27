"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Camera, CopyIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { generateDigitalCoin } from "@/actions";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { FormSkeleton } from "./FormSkeleton";

interface DigitalMoneyFormProps {
  onClose: () => void;
}

type Location = {
  id: string;
  name: string;
};

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
  idPhoto: z
    .any()
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

type FormValues = z.infer<typeof formSchema>;

export default function DigitalMoneyForm({ onClose }: DigitalMoneyFormProps) {
  const [countries, setCountries] = useState<Location[]>([]);
  const [states, setStates] = useState<Location[]>([]);
  const [cities, setCities] = useState<Location[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { copied, copy } = useCopyToClipboard();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      country: "",
      state: "",
      city: "",
      amount: "100",
      phone: "",
      businessTIN: "",
    },
  });

  const { watch, control } = form;
  const selectedCountry = watch("country");
  const selectedState = watch("state");

  const apiUrl = "https://tugza.tech";

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/locations`);
        const data = await res.json();
        setCountries(data.countries);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        toast.error("Failed to load countries");
      } finally {
        setIsFormLoading(false);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      if (selectedCountry) {
        try {
          const countryId = countries.find(
            (c) => c.name === selectedCountry
          )?.id;
          const res = await fetch(
            `${apiUrl}/api/locations?countryId=${countryId}`
          );
          const data = await res.json();
          setStates(data.states);
          form.setValue("state", "");
          form.setValue("city", "");
        } catch (error) {
          console.error("Failed to fetch states:", error);
          toast.error("Failed to load states");
        }
      }
    };
    fetchStates();
  }, [selectedCountry, countries, form]);

  useEffect(() => {
    const fetchCities = async () => {
      if (selectedState) {
        try {
          const countryId = countries.find(
            (c) => c.name === selectedCountry
          )?.id;
          const stateId = states.find((s) => s.name === selectedState)?.id;
          const res = await fetch(
            `${apiUrl}/api/locations?countryId=${countryId}&stateId=${stateId}`
          );
          const data = await res.json();
          setCities(data.cities);
          form.setValue("city", "");
        } catch (error) {
          console.error("Failed to fetch cities:", error);
          toast.error("Failed to load cities");
        }
      }
    };
    fetchCities();
  }, [selectedState, selectedCountry, countries, states, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("idPhoto", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        toast.success("ID photo uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      let uploadedUrl = "";
      if (data.idPhoto) {
        const formData = new FormData();
        formData.append("file", data.idPhoto);
        formData.append("folder", "growth");

        const uploadResponse = await fetch("https://file.tugza.tech", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }
        const { url } = await uploadResponse.json();
        uploadedUrl = url;
      }

      const response = await generateDigitalCoin({
        ...data,
        idPhoto: uploadedUrl,
      });
      if (!response?.success) {
        throw new Error("Failed to submit form");
      }

      toast.success(`Your ${data.amount} Coin Generated`, {
        dismissible: true,
        duration: 50000,
        description: (
          <div className="flex items-center justify-between">
            <span>Your Token Number is: {response.coinToken}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copy(response.coinToken || "")}
            >
              {copied ? (
                "Copied!"
              ) : (
                <>
                  <CopyIcon className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        ),
      });
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Digital money request failed!", {
        description: "Failed to submit form. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6">
          Take Digital Money
        </h2>

        {isFormLoading ? (
          <FormSkeleton />
        ) : (
          <>
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

            <Controller
              name="country"
              control={control}
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
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              name="state"
              control={control}
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
                      {states.map((state) => (
                        <SelectItem key={state.id} value={state.name}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              name="city"
              control={control}
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
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.name}>
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter Phone Number (e.g., 0909090909)"
                      maxLength={10}
                    />
                  </FormControl>
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
                          src={previewUrl || "/placeholder.svg"}
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

            <Controller
              name="amount"
              control={control}
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
