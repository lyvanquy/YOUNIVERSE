"use client";

import { useRouter } from "next/navigation";
import AboutView from "../components/AboutView";

export default function AboutPage() {
  const router = useRouter();

  return <AboutView onGoProducts={() => router.push("/products")} />;
}
