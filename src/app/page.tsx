import { Leaf } from "lucide-react";
import BanksCard from "./BanksCard";

export const banks = [
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
  {
    name: "Abyssinia Bank",
    description: "Trusted banking partner in Ethiopia",
    image: "/abyssinia.jpg",
    link: "abyssinia",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold text-gray-800">Tugza</span>
          </div>
          <nav>
            <ul className="flex space-x-4"></ul>
          </nav>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-10 pb-0 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Tugza Tech for a Greener Future
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover our range of sustainable and innovative products
          </p>
        </section>

        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            List Of Banks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {banks.map((bank, index) => (
              <BanksCard key={index} {...bank} />
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Tugza</h3>
              <p className="text-gray-400">
                Innovative technology for a sustainable future.
              </p>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            <p>&copy; 2025 Tugza. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
