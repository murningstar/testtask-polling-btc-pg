-- CreateTable
CREATE TABLE "BtcUpdate" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "json" JSONB NOT NULL,

    CONSTRAINT "BtcUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BtcUpdate_timestamp_idx" ON "BtcUpdate"("timestamp");
