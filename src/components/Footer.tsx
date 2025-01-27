import React from "react";

export default function Footer() {
  return (
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
  );
}
