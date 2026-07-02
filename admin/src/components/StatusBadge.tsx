import Badge from "./Badge";
import type { OrderStatus, PaymentStatus, ProductStatus } from "../types/api";

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const tone: "green" | "amber" | "red" | "neutral" =
    status === "ACTIVE" ? "green" : status === "DRAFT" ? "amber" : status === "ARCHIVED" ? "red" : "neutral";
  return <Badge tone={tone}>{status}</Badge>;
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const tone: "green" | "red" | "amber" | "blue" =
    status === "COMPLETED"
      ? "green"
      : status === "CANCELLED" || status === "REFUNDED"
        ? "red"
        : status === "PENDING_PAYMENT"
          ? "amber"
          : "blue";
  return <Badge tone={tone}>{status}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus | null }) {
  if (!status) return <Badge>NO_PAYMENT</Badge>;
  const tone: "green" | "red" | "amber" = status === "PAID" ? "green" : status === "FAILED" || status === "CANCELLED" ? "red" : "amber";
  return <Badge tone={tone}>{status}</Badge>;
}
