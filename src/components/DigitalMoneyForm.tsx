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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const newUserFormSchema = z.object({
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
    .refine((file) => file instanceof File, "Please upload an ID photo")
    .refine((file) => file.size <= 5000000, "Max file size is 5MB.")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only .jpg, .png, and .webp formats are supported."
    ),
  businessTIN: z
    .string()
    .regex(/^\d{8,15}$/, "Business TIN must be between 8 and 15 digits"),
});

const registeredUserFormSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
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
});

type NewUserFormValues = z.infer<typeof newUserFormSchema>;
type RegisteredUserFormValues = z.infer<typeof registeredUserFormSchema>;

export default function DigitalMoneyForm({ onClose }: DigitalMoneyFormProps) {
  const [countries, setCountries] = useState<Location[]>([]);
  const [states, setStates] = useState<Location[]>([]);
  const [cities, setCities] = useState<Location[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { copied, copy } = useCopyToClipboard();

  const newUserForm = useForm<NewUserFormValues>({
    resolver: zodResolver(newUserFormSchema),
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

  const registeredUserForm = useForm<RegisteredUserFormValues>({
    resolver: zodResolver(registeredUserFormSchema),
    defaultValues: {
      amount: "100",
      phone: "",
    },
  });

  const { watch: watchNewUser, control: controlNewUser } = newUserForm;
  const selectedCountry = watchNewUser("country");
  const selectedState = watchNewUser("state");

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
          newUserForm.setValue("state", "");
          newUserForm.setValue("city", "");
        } catch (error) {
          console.error("Failed to fetch states:", error);
          toast.error("Failed to load states");
        }
      }
    };
    fetchStates();
  }, [selectedCountry, countries, newUserForm]);

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
          newUserForm.setValue("city", "");
        } catch (error) {
          console.error("Failed to fetch cities:", error);
          toast.error("Failed to load cities");
        }
      }
    };
    fetchCities();
  }, [selectedState, selectedCountry, countries, states, newUserForm]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      newUserForm.setValue("idPhoto", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        toast.success("ID photo uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitNewUser = async (data: NewUserFormValues) => {
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
        isExistingUser: false,
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

  const onSubmitRegisteredUser = async (data: RegisteredUserFormValues) => {
    setIsLoading(true);
    try {
      const response = await generateDigitalCoin({
        ...data,
        isExistingUser: true,
      });
      if (!response?.success) {
        throw new Error(response.error || "Failed to generate digital money");
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
      console.error("Error generating digital money:", error);
      toast.error("Digital money request failed!", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Take Digital Money</CardTitle>
        <CardDescription>
          Generate digital money for new or existing users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="new-user" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new-user">New User</TabsTrigger>
            <TabsTrigger value="registered-user">Registered User</TabsTrigger>
          </TabsList>
          <TabsContent value="new-user">
            <Form {...newUserForm}>
              <form
                onSubmit={newUserForm.handleSubmit(onSubmitNewUser)}
                className="space-y-4"
              >
                {isFormLoading ? (
                  <FormSkeleton />
                ) : (
                  <>
                    <FormField
                      control={newUserForm.control}
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
                      control={controlNewUser}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem
                                  key={country.id}
                                  value={country.name}
                                >
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
                      control={controlNewUser}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
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
                      control={controlNewUser}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
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
                      control={newUserForm.control}
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
                      control={newUserForm.control}
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
                      control={newUserForm.control}
                      name="businessTIN"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business TIN</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="8 to 15-digit Business TIN"
                              maxLength={15}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Controller
                      name="amount"
                      control={controlNewUser}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
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
          </TabsContent>
          <TabsContent value="registered-user">
            <Form {...registeredUserForm}>
              <form
                onSubmit={registeredUserForm.handleSubmit(
                  onSubmitRegisteredUser
                )}
                className="space-y-4"
              >
                {isFormLoading ? (
                  <FormSkeleton />
                ) : (
                  <>
                    <FormField
                      control={registeredUserForm.control}
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

                    <Controller
                      name="amount"
                      control={registeredUserForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
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
                            Generating...
                          </>
                        ) : (
                          "Generate Digital Money"
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
