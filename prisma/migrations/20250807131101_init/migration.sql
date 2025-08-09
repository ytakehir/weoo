-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "created_at" SET DEFAULT timezone('utc', now());

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "created_at" SET DEFAULT timezone('utc', now()),
ALTER COLUMN "updated_at" SET DEFAULT timezone('utc', now());
