import Image from "next/image";
import React from "react";

export default function Header() {
  return (
    <header className="bg-transparent shadow-sm">
      <div className="bg-transparent container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image
            alt="logo"
            src={
              "https://tugza.tech/_next/image?url=https%3A%2F%2Ftugza.com%2Fimages%2Ficons%2Flogo.jpg&w=128&q=75"
            }
            width={100}
            height={100}
            className="size-10 rounded-full text-green-600"
          />
          <span className="text-xl font-bold text-gray-800">Tugza Bank</span>
        </div>
        <nav>
          <ul className="flex space-x-4"></ul>
        </nav>
      </div>
    </header>
  );
}
