-- CreateTable
CREATE TABLE "AdminRole" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roleName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_AdminToAdminRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AdminToAdminRole_A_fkey" FOREIGN KEY ("A") REFERENCES "Admin" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AdminToAdminRole_B_fkey" FOREIGN KEY ("B") REFERENCES "AdminRole" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminRole_roleName_key" ON "AdminRole"("roleName");

-- CreateIndex
CREATE UNIQUE INDEX "_AdminToAdminRole_AB_unique" ON "_AdminToAdminRole"("A", "B");

-- CreateIndex
CREATE INDEX "_AdminToAdminRole_B_index" ON "_AdminToAdminRole"("B");
