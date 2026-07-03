import type { PaymentSetting } from "@prisma/client";

import { prisma } from "../../config/prisma";
import type { UpdatePaymentSettingInput } from "./settings.validation";

const DEFAULT_PAYMENT_SETTING_ID = "default";

const normalizeText = (value: string | null | undefined) => {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const toPaymentSettingDto = (setting: PaymentSetting) => ({
  codEnabled: setting.codEnabled,
  bankTransferEnabled: setting.bankTransferEnabled,
  bankName: setting.bankName,
  bankAccountName: setting.bankAccountName,
  bankAccountNumber: setting.bankAccountNumber,
  bankBranch: setting.bankBranch,
  bankTransferQrImageUrl: setting.bankTransferQrImageUrl,
  bankTransferNote: setting.bankTransferNote,
  createdAt: setting.createdAt,
  updatedAt: setting.updatedAt,
});

export const getPaymentSetting = async () => {
  const setting = await prisma.paymentSetting.upsert({
    where: {
      id: DEFAULT_PAYMENT_SETTING_ID,
    },
    create: {
      id: DEFAULT_PAYMENT_SETTING_ID,
      codEnabled: true,
      bankTransferEnabled: true,
      bankTransferNote: "YOUniverse {orderCode}",
    },
    update: {},
  });

  return toPaymentSettingDto(setting);
};

export const updatePaymentSetting = async (input: UpdatePaymentSettingInput) => {
  const setting = await prisma.paymentSetting.upsert({
    where: {
      id: DEFAULT_PAYMENT_SETTING_ID,
    },
    create: {
      id: DEFAULT_PAYMENT_SETTING_ID,
      codEnabled: input.codEnabled ?? true,
      bankTransferEnabled: input.bankTransferEnabled ?? true,
      bankName: normalizeText(input.bankName),
      bankAccountName: normalizeText(input.bankAccountName),
      bankAccountNumber: normalizeText(input.bankAccountNumber),
      bankBranch: normalizeText(input.bankBranch),
      bankTransferQrImageUrl: normalizeText(input.bankTransferQrImageUrl),
      bankTransferNote: normalizeText(input.bankTransferNote) ?? "YOUniverse {orderCode}",
    },
    update: {
      ...(input.codEnabled !== undefined ? { codEnabled: input.codEnabled } : {}),
      ...(input.bankTransferEnabled !== undefined ? { bankTransferEnabled: input.bankTransferEnabled } : {}),
      ...(input.bankName !== undefined ? { bankName: normalizeText(input.bankName) } : {}),
      ...(input.bankAccountName !== undefined ? { bankAccountName: normalizeText(input.bankAccountName) } : {}),
      ...(input.bankAccountNumber !== undefined ? { bankAccountNumber: normalizeText(input.bankAccountNumber) } : {}),
      ...(input.bankBranch !== undefined ? { bankBranch: normalizeText(input.bankBranch) } : {}),
      ...(input.bankTransferQrImageUrl !== undefined ? { bankTransferQrImageUrl: normalizeText(input.bankTransferQrImageUrl) } : {}),
      ...(input.bankTransferNote !== undefined ? { bankTransferNote: normalizeText(input.bankTransferNote) } : {}),
    },
  });

  return toPaymentSettingDto(setting);
};
