"use client";

import { useState, useEffect } from "react";
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

interface DigitalMoneyFormProps {
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  country: z.object({ id: z.string(), name: z.string() }),
  state: z.object({ id: z.string(), name: z.string() }),
  city: z.object({ id: z.string(), name: z.string() }),
  amount: z.enum(["5", "10", "15", "25", "50", "100"]),
});

export default function DigitalMoneyForm({ onClose }: DigitalMoneyFormProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      country: { id: "", name: "" },
      state: { id: "", name: "" },
      city: { id: "", name: "" },
      amount: "5",
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
  const selectedState = watch("state");
  const apiUrl = "https://tugza.tech";
  useEffect(() => {
    fetch(`${apiUrl}/api/locations`)
      .then((res) => res.json())
      .then((data) => setCountries(data.countries));
  }, []);

  useEffect(() => {
    if (selectedCountry?.id) {
      fetch(`${apiUrl}/api/locations?countryId=${selectedCountry.id}`)
        .then((res) => res.json())
        .then((data) => setStates(data.states));
      form.setValue("state", { id: "", name: "" });
      form.setValue("city", { id: "", name: "" });
    }
  }, [selectedCountry, form]);

  useEffect(() => {
    if (selectedState?.id || 0) {
      fetch(
        `${apiUrl}/api/locations?countryId=${selectedCountry.id}&stateId=${selectedState.id}`
      )
        .then((res) => res.json())
        .then((data) => setCities(data.cities));
      form.setValue("city", { id: "", name: "" });
    }
  }, [selectedState, selectedCountry, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/digital-money", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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
                <Input {...field} />
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
              <Select
                onValueChange={(value) => {
                  const selectedCountry = countries.find((c) => c.id === value);
                  field.onChange(selectedCountry);
                }}
                value={field.value.id}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries?.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
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
              <Select
                onValueChange={(value) => {
                  const selectedState = states.find((s) => s.id === value);
                  field.onChange(selectedState);
                }}
                value={field.value.id}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {states?.map((state) => (
                    <SelectItem key={state.id} value={state.id}>
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
              <Select
                onValueChange={(value) => {
                  const selectedCity = cities.find((c) => c.id === value);
                  field.onChange(selectedCity);
                }}
                value={field.value.id}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cities?.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
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
                  {["5", "10", "15", "25", "50", "100"].map((amount) => (
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
