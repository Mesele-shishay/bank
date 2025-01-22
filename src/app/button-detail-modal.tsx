"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exportUserData } from "@/actions";

export function BookDetailModal({ onClose }: { onClose: () => void }) {
  const [selectedCity, setSelectedCity] = useState("");

  const handleExport = async () => {
    if (selectedCity) {
      await exportUserData(selectedCity);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Export User Data</h2>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger>
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new-york">New York</SelectItem>
            <SelectItem value="los-angeles">Los Angeles</SelectItem>
            <SelectItem value="chicago">Chicago</SelectItem>
            <SelectItem value="houston">Houston</SelectItem>
            <SelectItem value="phoenix">Phoenix</SelectItem>
          </SelectContent>
        </Select>
        <div className="mt-4 space-x-2">
          <Button onClick={handleExport} disabled={!selectedCity}>
            Export Data
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
