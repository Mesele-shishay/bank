"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignUpForm } from "./signup-form";
import { BookDetailModal } from "./button-detail-modal";

export function LandingPage() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showBookDetail, setShowBookDetail] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-800 mb-8">
        Welcome to Our Bank
      </h1>
      <div className="space-x-4">
        <Button onClick={() => setShowSignUp(true)}>Get Account Book</Button>
        <Button onClick={() => setShowBookDetail(true)}>
          Take Book Detail
        </Button>
      </div>
      {showSignUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b">
              <Button onClick={() => setShowSignUp(false)}>Close</Button>
            </div>
            <div className="p-4">
              <SignUpForm />
            </div>
          </div>
        </div>
      )}
      {showBookDetail && (
        <BookDetailModal onClose={() => setShowBookDetail(false)} />
      )}
    </div>
  );
}
