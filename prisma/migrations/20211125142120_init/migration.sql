-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "discord_id" TEXT NOT NULL,
    "wallet" INTEGER NOT NULL DEFAULT 0,
    "bank" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discord_id_key" ON "User"("discord_id");
