import { PaymentProvider } from "@prisma/client";
import { z } from "zod";

const optionalText = z.string().trim().min(1).max(500).optional().nullable();

export const checkoutSchema = z.object({
  cartId: z.string().trim().min(1, "Cart is required"),
  customer: z.object({
    fullName: z.string().trim().min(1, "Full name is required").max(100),
    email: z.string().trim().max(254).email("Invalid email").toLowerCase(),
    phone: z.string().trim().min(1, "Phone is required").max(30),
  }),
  shipping: z.object({
    addressLine: z.string().trim().min(1, "Address is required").max(500),
    ward: optionalText,
    district: optionalText,
    province: optionalText,
  }),
  paymentProvider: z.nativeEnum(PaymentProvider).default(PaymentProvider.COD),
  couponCode: z.string().trim().min(1).transform((value) => value.toUpperCase()).optional().nullable(),
  note: optionalText,
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
