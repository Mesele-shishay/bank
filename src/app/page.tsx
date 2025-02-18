"use client";

import { useState } from "react";
import BanksCard from "./BanksCard";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import DigitalMoneyForm from "@/components/DigitalMoneyForm";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";

export const banks = [
  {
    name: "Bank of Abyssinia",
    description: "Trusted banking partner in Ethiopia",
    image: "/abyssinia.jpg",
    link: "boa",
  },
  {
    name: "Coop Bank",
    description: "Cooperative Bank of Oromia",
    image: "/coop.jpg",
    link: "coop",
  },
  {
    name: "Awash Bank",
    description: "One of Ethiopia's leading private banks",
    image: "/awash.jpg",
    link: "awash",
  },
  {
    name: "Tsehay Bank",
    description: "Emerging bank in Ethiopia",
    image: "/tsehay.jpg",
    link: "tsehay",
  },
  {
    name: "Nib Bank",
    description: "Innovative banking solutions",
    image: "/nib.jpg",
    link: "nib",
  },
  {
    name: "Gedda Bank",
    description: "Serving the financial needs of Ethiopia",
    image: "/gedda.jpg",
    link: "gedda",
  },
];

export default function Home() {
  const [isBanksModalOpen, setIsBanksModalOpen] = useState(false);
  const [isDigitalMoneyModalOpen, setIsDigitalMoneyModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <Header />
      <main>
        <section className="container mx-auto px-4 py-10 pb-0 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            TUGZA Innovative Bank for Africa
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get TUGZA digital money to use our innovative products
          </p>
          <div className="grid grid-cols-2 gap-4 mb-3 max-w-4xl mx-auto">
            <Button onClick={() => setIsDigitalMoneyModalOpen(true)}>
              Take Digital Money
            </Button>
            <Button onClick={() => setIsBanksModalOpen(true)} className="">
              List of Banks
            </Button>
          </div>
        </section>
      </main>

      <Modal
        isOpen={isBanksModalOpen}
        onClose={() => setIsBanksModalOpen(false)}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          List Of Banks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {banks.map((bank, index) => (
            <BanksCard key={index} {...bank} />
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={isDigitalMoneyModalOpen}
        onClose={() => setIsDigitalMoneyModalOpen(false)}
      >
        <DigitalMoneyForm onClose={() => setIsDigitalMoneyModalOpen(false)} />
      </Modal>

      <footer className="bg-gray-800 text-white py-8 fixed bottom-0 left-0 right-0">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Tugza Bank</h3>
              <p className="text-gray-400">
                TUGZA Innovations for potentially enhanced future!
              </p>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            <p>&copy; 2025 Tugza Bank. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
