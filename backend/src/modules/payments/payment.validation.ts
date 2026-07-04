import { z } from "zod";

export const submitReceiptSchema = z.object({
  orderId: z.string().trim().cuid("Invalid order id"),
  receiptUrl: z.string().trim().url("Invalid receipt URL").max(1000),
});

export type SubmitReceiptInput = z.infer<typeof submitReceiptSchema>;
