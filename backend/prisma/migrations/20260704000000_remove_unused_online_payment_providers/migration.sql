BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "PaymentTransaction"
    WHERE "provider"::text NOT IN ('COD', 'BANK_TRANSFER')
  ) THEN
    RAISE EXCEPTION 'Cannot remove unused payment providers while related payment transactions still exist';
  END IF;
END
$$;

CREATE TYPE "PaymentProvider_new" AS ENUM ('COD', 'BANK_TRANSFER');

ALTER TABLE "PaymentTransaction"
  ALTER COLUMN "provider" TYPE "PaymentProvider_new"
  USING ("provider"::text::"PaymentProvider_new");

DROP TYPE "PaymentProvider";
ALTER TYPE "PaymentProvider_new" RENAME TO "PaymentProvider";

ALTER TABLE "PaymentTransaction" DROP COLUMN "paymentUrl";

COMMIT;
