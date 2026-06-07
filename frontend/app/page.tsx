"use client";

import { useRouter } from "next/navigation";
import HomeView from "./components/HomeView";
import { useYouniverseApp } from "./YouniverseApp";

export default function Home() {
  const router = useRouter();
  const { addCustomToCart } = useYouniverseApp();

  return (
    <HomeView
      onGoAbout={() => router.push("/about")}
      onGoProducts={() => router.push("/products")}
      onAddCustomToCart={addCustomToCart}
    />
  );
}
