"use client";

import ProductsView from "../components/ProductsView";
import { useYouniverseApp } from "../YouniverseApp";

export default function ProductsPage() {
  const { notifySoon } = useYouniverseApp();

  return <ProductsView onNotifySoon={notifySoon} />;
}
