"use client";

import HomeView from "./components/HomeView";
import { useYouniverseApp } from "./YouniverseApp";

export default function Home() {
  const { addCustomToCart } = useYouniverseApp();

  return (
    <HomeView
      onAddCustomToCart={addCustomToCart}
    />
  );
}
