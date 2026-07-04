ALTER TABLE "Order" ADD COLUMN "guestSessionId" TEXT;

CREATE INDEX "Order_guestSessionId_idx" ON "Order"("guestSessionId");
