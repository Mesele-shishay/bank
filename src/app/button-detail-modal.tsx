"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { exportUserData } from "@/actions";
import * as XLSX from "xlsx";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type City = {
  id: number;
  state_id: number;
  name: string;
};

type State = {
  id: number;
  name: string;
  country_id: number;
  iso: string;
};

interface BookDetailModalProps {
  onClose: () => void;
  bank?: string;
}

function BookDetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

export function BookDetailModal({ onClose, bank }: BookDetailModalProps) {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const handleExport = async () => {
    if (selectedCity) {
      if (verifyPassword(password)) {
        setIsProcessing(true);
        setPasswordError("");
        try {
          const result = await exportUserData({
            selectedCity,
            bank: bank || "",
          });
          if (result.success && result.userData) {
            const workBook = XLSX.utils.book_new();
            const workSheet = XLSX.utils.json_to_sheet(result.userData);
            XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
            XLSX.writeFile(workBook, `user_data_for_${bank}_bank.xlsx`);
            onClose();
          } else {
            throw new Error(result.error || "Failed to generate spreadsheet");
          }
        } catch (error) {
          console.error("Error exporting data:", error);
          setPasswordError("An error occurred while exporting data.");
        } finally {
          setIsProcessing(false);
        }
      } else {
        setPasswordError("Password is not correct");
      }
    }
  };

  const verifyPassword = (inputPassword: string) => {
    const correctPassword = "password";
    return inputPassword === correctPassword;
  };

  useEffect(() => {
    const fetchStates = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://tugza.tech/api/states");
        if (!response.ok) {
          throw new Error("Failed to fetch states");
        }
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
      if (selectedState) {
        try {
          const response = await fetch(
            `https://tugza.tech/api/city-state/${selectedState}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch cities");
          }
          const data = await response.json();
          setCities(data);
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      }
    };
    fetchCities();
  }, [selectedState]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        {isLoading ? (
          <BookDetailSkeleton />
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Export User Data</h2>
            <div className="grid grid-cols-1 gap-3">
              <Select onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a State" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.id} value={state.id.toString()}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
            </div>
            <div className="mt-4 space-x-2">
              <Button
                onClick={handleExport}
                disabled={!selectedCity || !password || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Export Data"
                )}
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
