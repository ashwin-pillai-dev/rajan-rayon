-- CreateTable
CREATE TABLE "Material" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "stock" REAL NOT NULL DEFAULT 0.0,
    "unitSize" REAL NOT NULL DEFAULT 0.0,
    "units" INTEGER NOT NULL DEFAULT 0,
    "unitPrice" REAL NOT NULL DEFAULT 0.0,
    "reorderLevel" REAL NOT NULL DEFAULT 0.0,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Color" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "hexCode" TEXT,
    "stock" REAL NOT NULL DEFAULT 0.0,
    "unitSize" REAL NOT NULL DEFAULT 0.0,
    "units" INTEGER NOT NULL DEFAULT 0,
    "unitPrice" REAL NOT NULL DEFAULT 0.0,
    "reorderLevel" REAL NOT NULL DEFAULT 0.0,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Chemical" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "stock" REAL NOT NULL DEFAULT 0.0,
    "unitPrice" REAL NOT NULL DEFAULT 0.0,
    "reorderLevel" REAL NOT NULL DEFAULT 0.0,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Shade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "stock" REAL NOT NULL DEFAULT 0.0,
    "unitSize" REAL NOT NULL DEFAULT 0.0,
    "units" INTEGER NOT NULL DEFAULT 0,
    "reorderLevel" REAL NOT NULL DEFAULT 0.0,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MaterialPurchase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "materialId" INTEGER NOT NULL,
    "quantity" REAL NOT NULL,
    "unitPrice" REAL NOT NULL,
    "billDate" DATETIME NOT NULL,
    "receivingDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MaterialPurchase_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ColorPurchase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "colorId" INTEGER NOT NULL,
    "quantity" REAL NOT NULL,
    "unitPrice" REAL NOT NULL,
    "billDate" DATETIME NOT NULL,
    "receivingDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ColorPurchase_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChemicalPurchase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chemicalId" INTEGER NOT NULL,
    "quantity" REAL NOT NULL,
    "unitPrice" REAL NOT NULL,
    "billDate" DATETIME NOT NULL,
    "receivingDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChemicalPurchase_chemicalId_fkey" FOREIGN KEY ("chemicalId") REFERENCES "Chemical" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ColorComposition" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shadeId" INTEGER NOT NULL,
    "colorId" INTEGER NOT NULL,
    "percentage" REAL NOT NULL,
    CONSTRAINT "ColorComposition_shadeId_fkey" FOREIGN KEY ("shadeId") REFERENCES "Shade" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ColorComposition_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChemicalComposition" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shadeId" INTEGER NOT NULL,
    "chemicalId" INTEGER NOT NULL,
    "quantity" REAL NOT NULL,
    CONSTRAINT "ChemicalComposition_shadeId_fkey" FOREIGN KEY ("shadeId") REFERENCES "Shade" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChemicalComposition_chemicalId_fkey" FOREIGN KEY ("chemicalId") REFERENCES "Chemical" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductionLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT,
    "producedShadeId" INTEGER,
    "producedQuantity" REAL NOT NULL,
    "cost" REAL NOT NULL DEFAULT 0.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductionLog_producedShadeId_fkey" FOREIGN KEY ("producedShadeId") REFERENCES "Shade" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductionMaterial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productionLogId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "quantity" REAL NOT NULL,
    "cost" REAL NOT NULL,
    CONSTRAINT "ProductionMaterial_productionLogId_fkey" FOREIGN KEY ("productionLogId") REFERENCES "ProductionLog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductionMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductionColor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productionLogId" INTEGER NOT NULL,
    "colorId" INTEGER NOT NULL,
    "quantity" REAL NOT NULL,
    "cost" REAL NOT NULL,
    CONSTRAINT "ProductionColor_productionLogId_fkey" FOREIGN KEY ("productionLogId") REFERENCES "ProductionLog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductionColor_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductionChemical" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productionLogId" INTEGER NOT NULL,
    "chemicalId" INTEGER NOT NULL,
    "quantity" REAL NOT NULL,
    "cost" REAL NOT NULL,
    CONSTRAINT "ProductionChemical_productionLogId_fkey" FOREIGN KEY ("productionLogId") REFERENCES "ProductionLog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductionChemical_chemicalId_fkey" FOREIGN KEY ("chemicalId") REFERENCES "Chemical" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TransactionLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "transactionType" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "units" INTEGER NOT NULL,
    "description" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "productionLogId" INTEGER,
    "supplierId" INTEGER,
    "billDate" DATETIME,
    "receivingDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TransactionLog_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransactionLog_productionLogId_fkey" FOREIGN KEY ("productionLogId") REFERENCES "ProductionLog" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "contactInfo" TEXT,
    "address" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_MaterialToSupplier" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MaterialToSupplier_A_fkey" FOREIGN KEY ("A") REFERENCES "Material" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MaterialToSupplier_B_fkey" FOREIGN KEY ("B") REFERENCES "Supplier" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ColorToSupplier" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ColorToSupplier_A_fkey" FOREIGN KEY ("A") REFERENCES "Color" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ColorToSupplier_B_fkey" FOREIGN KEY ("B") REFERENCES "Supplier" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Material_name_key" ON "Material"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Color_name_key" ON "Color"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Chemical_name_key" ON "Chemical"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Shade_name_key" ON "Shade"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "Supplier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_MaterialToSupplier_AB_unique" ON "_MaterialToSupplier"("A", "B");

-- CreateIndex
CREATE INDEX "_MaterialToSupplier_B_index" ON "_MaterialToSupplier"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ColorToSupplier_AB_unique" ON "_ColorToSupplier"("A", "B");

-- CreateIndex
CREATE INDEX "_ColorToSupplier_B_index" ON "_ColorToSupplier"("B");
