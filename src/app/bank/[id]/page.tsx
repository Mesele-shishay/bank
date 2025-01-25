"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignUpForm } from "@/app/signup-form";
import { BookDetailModal } from "@/app/button-detail-modal";
import { banks } from "@/app/page";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showBookDetail, setShowBookDetail] = useState(false);
  const bank = banks.filter((item) => item.link === id);
  console.log(bank);
  if (!bank.length) {
    return <div>Bank not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-800 mb-8">
        Welcome to Our {bank[0].name}
      </h1>
      <div className="space-x-4">
        <Button onClick={() => setShowSignUp(true)}>Get Account Book</Button>
        <Button onClick={() => setShowBookDetail(true)}>
          Take Book Detail
        </Button>
      </div>
      {showSignUp && (
        <div className="fixed inset-0 bg-black bg-opacJity-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b">
              <Button onClick={() => setShowSignUp(false)}>Close</Button>
            </div>
            <div className="p-4">
              <SignUpForm bank={bank[0].link} />
            </div>
          </div>
        </div>
      )}
      {showBookDetail && (
        <BookDetailModal
          bank={bank[0].link}
          onClose={() => setShowBookDetail(false)}
        />
      )}
    </div>
  );
}
