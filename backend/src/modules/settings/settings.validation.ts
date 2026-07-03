import { z } from "zod";

const optionalText = z.string().trim().max(1000).optional().nullable();
const optionalUrl = z.string().trim().url("Invalid URL").max(1000).optional().nullable();

export const updatePaymentSettingSchema = z.object({
  codEnabled: z.boolean().optional(),
  bankTransferEnabled: z.boolean().optional(),
  bankName: optionalText,
  bankAccountName: optionalText,
  bankAccountNumber: optionalText,
  bankBranch: optionalText,
  bankTransferQrImageUrl: optionalUrl,
  bankTransferNote: optionalText,
});

export type UpdatePaymentSettingInput = z.infer<typeof updatePaymentSettingSchema>;
