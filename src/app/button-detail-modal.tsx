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

export function BookDetailModal({
  onClose,
  bank,
}: {
  onClose: () => void;
  bank: string;
}) {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const handleExport = async () => {
    if (selectedCity) {
      if (verifyPassword(password)) {
        setIsProcessing(true);
        setPasswordError("");
        try {
          const result = await exportUserData({ selectedCity, bank });
          console.log(result);
          if (result.success && result.fileUrl) {
            // Create a temporary anchor element and trigger the download
            const link = document.createElement("a");
            link.href = result.fileUrl;
            link.download =
              result.fileName || `user_data_${selectedCity}_${bank}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
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
    // Replace this with your actual password verification logic
    const correctPassword = "password";
    return inputPassword === correctPassword;
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch("https://tugza.tech/api/states");
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error("Error fetching states:", error);
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
            {isProcessing ? "Processing..." : "Export Data"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
