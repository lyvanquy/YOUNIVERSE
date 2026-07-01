"use client";

import ProductsView from "../components/ProductsView";
import { useYouniverseApp } from "../YouniverseApp";

export default function ProductsViewWrapper() {
  const { notifySoon } = useYouniverseApp();

  return <ProductsView onNotifySoon={notifySoon} />;
}
