-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "originalPrice" REAL,
    "image" TEXT NOT NULL,
    "bannerImage" TEXT,
    "platform" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rating" REAL NOT NULL DEFAULT 4.8,
    "genre" TEXT NOT NULL,
    "sellerName" TEXT NOT NULL DEFAULT 'FastKeys Official',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isHot" BOOLEAN NOT NULL DEFAULT false,
    "isRecent" BOOLEAN NOT NULL DEFAULT false,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("bannerImage", "createdAt", "description", "genre", "id", "image", "isFeatured", "isHot", "originalPrice", "platform", "price", "rating", "region", "sellerName", "slug", "title", "type", "updatedAt") SELECT "bannerImage", "createdAt", "description", "genre", "id", "image", "isFeatured", "isHot", "originalPrice", "platform", "price", "rating", "region", "sellerName", "slug", "title", "type", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
