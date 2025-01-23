import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProductCardProps {
  name: string;
  description: string;
  image: string;
  link: string;
}

export default function BanksCard({
  name,
  description,
  image,
  link,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <Image
        src={image || "/placeholder.svg"}
        alt={name}
        width={400}
        height={200}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50">
        <Link href={"/bank/" + link} className="w-full">
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
            Select
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
