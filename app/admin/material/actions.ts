'use server'
import { Material, Prisma, TransactionLog } from '@prisma/client';
import prisma from '../../../lib/prisma';
import { materialFormType } from './add/materialSchema';
import { inwardTransactionFormType } from '../components/zodSchemas/inwardTransacrionSchema';






export async function addMaterial(input: materialFormType): Promise<Material> {
    const { name, avgPrice, quantity } = input
    const data: Prisma.MaterialCreateInput = {
        name: name,
        avgPrice,
        quantity,
    }
    let material: Material;
    try {
        material = await prisma.material.create({
            data
        });

        return material;
    } catch (error) {
        console.error('Error adding material:', error);
        throw error;
    }
}

export type transactionWithMaterial = Prisma.TransactionLogGetPayload<
    {
        include: {
            material: true,
            supplier: true,
        }
    }
>

export async function addStocksToMaterial(params: inwardTransactionFormType) {
    const data: Prisma.TransactionLogCreateInput = {
        quantity: params.quantity,
        transactionType: params.transactionType,
        entityType: params.entityType,
        billDate: params.billDate,
        invoice: params.invoice,
        totalAmount: params.totalAmount,
        receivingDate: params.receivingDate,
        transportationCost: params.transportationCost,
        units: params.totalAmount,
        material: {
            connect: {
                id: params.entityId
            },
        },
        supplier:{
            connect:{
                id:params.supplierId
            }
        }

    }
    console.log('addStocksToMaterialData: ', data);


    const res: transactionWithMaterial = await prisma.transactionLog.create({
        data,
        include: {
            material: true,
            supplier: true,
        }
    }
    ) 
    console.log('addStocksToMaterialResponse: ', res);



    return null;

}

export async function updateMaterial(input: materialFormType, id: number): Promise<Material> {

    const { name, avgPrice, quantity } = input


    const data: Prisma.MaterialUpdateInput = {
        name,
        avgPrice,
        quantity

    }
    let material: Material;
    try {

        material = await prisma.material.update({
            data,
            where: { id: id }

        });

        return material;

    } catch (error) {
        console.error('Error adding material:', error);
        throw error;
    }
}