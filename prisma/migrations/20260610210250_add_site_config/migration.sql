-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "homeColumns" INTEGER NOT NULL DEFAULT 4,
    "homeFeaturedCount" INTEGER NOT NULL DEFAULT 8,
    "catalogColumns" INTEGER NOT NULL DEFAULT 4,
    "updatedAt" DATETIME NOT NULL
);
