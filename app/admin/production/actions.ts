'use server';
import { Prisma, ProductionLog } from '@prisma/client';
import prisma from '../../../lib/prisma';
import { ProductionLogType } from './add/productionSchema';

export async function addProduction(input: ProductionLogType): Promise<ProductionLog> {
  const { batchNumber, productionDate, materialsUsed, quantityProduced, totalCosting = 0, shadeId, shade } = input
  console.log('shade: ', shade);

  let totalCostingSum = 0;

  const materialUsedInput: Prisma.ProductionMaterialCreateManyProductionLogInput[] = [];
  const transactionLogs: Prisma.TransactionLogCreateManyProductionLogInput[] = [];
  const colorUpdateArgsArray: Prisma.ColorUpdateArgs[] = [];
  const chemicalUpdateArgsArray: Prisma.ChemicalUpdateArgs[] = [];
  const materialUpdateArgsArray: Prisma.MaterialUpdateArgs[] = [];

  materialsUsed.forEach((material) => {
    if (material.entityType == 'COLOR') {
      if (material.colorId && material.color) {

        console.log('material: ', material);
        console.log('color: ', material?.color);

        // For material used input args creation (colors)

        //calculate costing
        const costingColor = material?.color.avgPrice * (material.quantity / 1000);


        const materialUsedColorEnitity: Prisma.ProductionMaterialCreateManyProductionLogInput = {
          colorId: material.colorId,
          quantity: material.quantity,
          entityType: 'COLOR',
          costing: costingColor,
        };
        console.log('material: ', material);
        console.log('color: ', material?.color);


        materialUsedInput.push(materialUsedColorEnitity);

        //update total costing for production log creation
        totalCostingSum += costingColor;

        //Create transaction log (color)

        const colorTransactionLog: Prisma.TransactionLogCreateManyProductionLogInput = {
          transactionType: 'OUTWARD',
          quantity: material.quantity,
          receivingDate: productionDate,
          units: material.quantity,
          entityType: material.entityType,
          totalAmount: (material?.color?.avgPrice ? material?.color?.avgPrice : 0) * (material.quantity / 1000),
          colorId: material.colorId,
          description: `${material.quantity} grams used in production of shade ${shade?.name} on ${productionDate.toDateString()}`

        }
        transactionLogs.push(colorTransactionLog);


        //arguments required to update color's totalQuantity and average pricice        
        //Calculate color's new totalAmount,totalQty and new average price
        //(material.quantity/1000) dividing by 1000 as it is inputted in grams but stored in kilograms
        const newTotalAmount = (material.color?.totalAmount ? material.color?.totalAmount : 0) - ((material.quantity / 1000) * material.color.avgPrice);
        const newTotalQty = (material.color?.quantity ? material.color?.quantity : 0) - (material.quantity / 1000);

        const newAvg = Number((newTotalAmount / newTotalQty).toFixed(2));


        colorUpdateArgsArray.push(
          {
            where: { id: material.colorId },
            data: {
              quantity:newTotalQty ,
              avgPrice: newAvg,
              totalAmount: Number(newTotalAmount.toFixed())
            }
          }
        )

      }
    }

    if (material.entityType == 'CHEMICAL') {
      if (material.chemicalId && material.chemical) {

        // For material used input args creation (chemicals)


        //calculate costing
        const costingChemical = material?.chemical.avgPrice * (material.quantity / 1000);


        const materialUsedChemicalEnitity: Prisma.ProductionMaterialCreateManyProductionLogInput = {
          chemicalId: material.chemicalId,
          quantity: material.quantity,
          entityType: 'CHEMICAL',
          costing: costingChemical,
        };

        materialUsedInput.push(materialUsedChemicalEnitity);

        //update total costing for production log creation
        totalCostingSum += costingChemical;

        //Create transaction log (chemicals)

        const chemicalTransactionLog: Prisma.TransactionLogCreateManyProductionLogInput = {
          transactionType: 'OUTWARD',
          quantity: material.quantity,
          receivingDate: productionDate,
          units: material.quantity,
          entityType: material.entityType,
          totalAmount: material?.chemical?.avgPrice ? material?.chemical?.avgPrice : 0 * (material.quantity / 1000),
          chemicalId: material.chemicalId,
          description: `${material.quantity} grams used in production of shade ${shade?.name} on ${productionDate.toDateString()}`

        }
        transactionLogs.push(chemicalTransactionLog);


        //argumnets required to update color's totalQuantity and average price

        //Calculate chemicals's new totalAmount,totalQty and new average price
        const newTotalAmount = (material.chemical?.totalAmount ? material.chemical?.totalAmount : 0) - ((material.quantity / 1000) * material.chemical.avgPrice);
        const newTotalQty = (material.chemical?.quantity ? material.chemical?.quantity : 0) - (material.quantity / 1000);
        const newAvg = Number((newTotalAmount / newTotalQty).toFixed(2));

        chemicalUpdateArgsArray.push(
          {
            where: { id: material.chemicalId },
            data: {
              quantity: newTotalQty,
              avgPrice: newAvg,
              totalAmount: Number(newTotalAmount.toFixed())
            }
          }
        )
      }
    }

    if (material.entityType == 'MATERIAL') {
      if (material.materialId && material.material) {

        // For material used input args creation (material)


        //calculate costing
        const costingMaterial = material?.material.avgPrice * (material.quantity);


        const materialUsedMaterialEnitity: Prisma.ProductionMaterialCreateManyProductionLogInput = {
          materialId: material.materialId,
          quantity: material.quantity,
          entityType: 'MATERIAL',
          costing: costingMaterial,
        };

        materialUsedInput.push(materialUsedMaterialEnitity);

        //update total costing for production log creation
        totalCostingSum += costingMaterial;

        //Create transaction log (chemicals)

        const materialTransactionLog: Prisma.TransactionLogCreateManyProductionLogInput = {
          transactionType: 'OUTWARD',
          quantity: material.quantity,
          receivingDate: productionDate,
          units: material.quantity,
          entityType: material.entityType,
          totalAmount: (material?.material?.avgPrice ? material?.material?.avgPrice : 0 )* (material.quantity),
          materialId: material.materialId,
          description: `${material.quantity} grams used in production of shade ${shade?.name} on ${productionDate.toDateString()}`

        }
        transactionLogs.push(materialTransactionLog);


        //argumnets required to update materials's totalQuantity and average price

        //Calculate chemicals's new totalAmount,totalQty and new average price
        const newTotalAmount = (material.material?.totalAmount ? material.material?.totalAmount : 0) - ((material.quantity) * material.material.avgPrice);
        const newTotalQty = (material.material?.quantity ? material.material?.quantity : 0) - (material.quantity);
        const newAvg = Number((newTotalAmount / newTotalQty).toFixed(2));

        materialUpdateArgsArray.push(
          {
            where: { id: material.materialId },
            data: {
              quantity: { decrement: material.quantity },
              avgPrice: newAvg,
              totalAmount: Number(newTotalAmount.toFixed())
            }
          }
        )
      }
    }
  }
  )

  // Producion log Prisma input with materials used and transaction logs
  const data: Prisma.ProductionLogCreateInput = {
    batchNumber: batchNumber,
    productionDate: productionDate,
    quantityProduced: quantityProduced,
    totalCosting: Number((totalCostingSum * quantityProduced).toFixed(2)),
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

  let productionLog: ProductionLog;

  try {
    productionLog = await prisma.$transaction(async (tx) => {

      // creating production log which includes creating transaction-logs and adding entries to production material as well
      const productionLogRes = await tx.productionLog.create({
        data,
      });
      // Execute color updates concurrently
      const colorUpdatePromises = colorUpdateArgsArray.map((arg) => tx.color.update(arg));


      // Execute chemical updates concurrently
      const chemicalUpdatePromises = chemicalUpdateArgsArray.map((arg) => tx.chemical.update(arg));
      const materialUpdatePromises = materialUpdateArgsArray.map((arg) => tx.material.update(arg));

      // Wait for all updates to complete
      await Promise.all([...colorUpdatePromises, ...chemicalUpdatePromises,...materialUpdatePromises]);
      return productionLogRes;
    }),
    {
      maxWait: 5000, // 5 seconds max wait to connect to prisma
      timeout: 20000, // 20 seconds
    }
    return productionLog;
  } catch (error) {
    console.error('Error adding Production log:', error);
    throw error;
  }
}