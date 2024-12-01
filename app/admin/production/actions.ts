'use server';
import { Supplier, Prisma, ProductionLog } from '@prisma/client';
import prisma from '../../../lib/prisma';
import { ProductionLogType, supplierFormType } from './add/productionSchema';

export async function addProduction(input: ProductionLogType): Promise<ProductionLog> {
  const { batchNumber, productionDate, materialsUsed, quantityProduced, totalCosting, shadeId, shade } = input
  console.log('shade: ', shade);


  const materialUsedInput: Prisma.ProductionMaterialCreateManyProductionLogInput[] = materialsUsed.map((material) => {
    delete material.chemical;
    delete material.color
    const materialUsedEnitity: Prisma.ProductionMaterialCreateManyProductionLogInput = {
      ...material
    };
    return materialUsedEnitity;

  })

  console.log('materialUsedInput: ', materialUsedInput);


  const transactionLogs: Prisma.TransactionLogCreateManyProductionLogInput[] = materialsUsed.map((material) => {
    if (material.entityType == 'CHEMICAL') {
      const transactionLog: Prisma.TransactionLogCreateManyProductionLogInput = {
        transactionType: 'OUTWARD',
        quantity: material.quantity,
        units: material.quantity,
        entityType: material.entityType,
        totalAmount: material?.chemical?.avgPrice ? material?.chemical?.avgPrice : 0 * material.quantity,
        chemicalId: material.chemicalId,
        description: `${material.quantity} grams used in production of shade ${shade?.name} on ${productionDate.toDateString()}`
      }
      return transactionLog;
    }
    else {
      const transactionLog: Prisma.TransactionLogCreateManyProductionLogInput = {
        transactionType: 'OUTWARD',
        quantity: material.quantity,
        units: material.quantity,
        entityType: material.entityType,
        totalAmount: material?.color?.avgPrice ? material?.color?.avgPrice : 0 * material.quantity,
        colorId: material.colorId,
        description: `${material.quantity} grams used in production of shade ${shade?.name} on ${productionDate.toDateString()}`

      }
      return transactionLog;

    }
  })

  console.log('transactionLogs: ', transactionLogs);


  const data: Prisma.ProductionLogCreateInput = {
    batchNumber: batchNumber,
    productionDate: productionDate,
    quantityProduced: quantityProduced,
    totalCosting: totalCosting,
    shade: {
      connect: {
        id: shadeId
      }
    },
    materialsUsed: {
      createMany: {
        data: materialUsedInput
      }
    },
    TransactionLog: {
      createMany: {
        data: transactionLogs
      }
    }
  };

  console.log('production args :', data);

  let productionLog: ProductionLog;
  try {
    productionLog = await prisma.productionLog.create({
      data,
    });
    return productionLog;
  } catch (error) {
    console.error('Error adding Production log:', error);
    throw error;
  }
}

export async function updateSupplier(input: supplierFormType, id: number): Promise<Supplier> {
  const { name, contactInfo, address, gstNumber } = input;

  const data: Prisma.SupplierUpdateInput = {
    name,
    contactInfo,
    address,
    gstNumber,
  };

  let supplier: Supplier;
  try {
    supplier = await prisma.supplier.update({
      data,
      where: { id: id },
    });
    return supplier;
  } catch (error) {
    console.error('Error updating supplier:', error);
    throw error;
  }
}
