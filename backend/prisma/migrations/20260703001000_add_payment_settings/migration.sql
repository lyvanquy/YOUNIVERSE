CREATE TABLE "PaymentSetting" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "codEnabled" BOOLEAN NOT NULL DEFAULT true,
    "bankTransferEnabled" BOOLEAN NOT NULL DEFAULT true,
    "bankName" TEXT,
    "bankAccountName" TEXT,
    "bankAccountNumber" TEXT,
    "bankBranch" TEXT,
    "bankTransferQrImageUrl" TEXT,
    "bankTransferNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentSetting_pkey" PRIMARY KEY ("id")
);

INSERT INTO "PaymentSetting" (
    "id",
    "codEnabled",
    "bankTransferEnabled",
    "bankTransferNote",
    "updatedAt"
) VALUES (
    'default',
    true,
    true,
    'YOUniverse {orderCode}',
    CURRENT_TIMESTAMP
) ON CONFLICT ("id") DO NOTHING;
