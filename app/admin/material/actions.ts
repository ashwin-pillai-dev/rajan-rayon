'use server'
import { Material, Prisma, TransactionLog } from '@prisma/client';
import prisma from '../../../lib/prisma';
import { materialFormType } from '../material/add/materialSchema';
import { inwardTransactionFormType } from '../components/zodSchemas/inwardTransacrionSchema';
import { redirect } from 'next/navigation';






export async function addMaterial(input: materialFormType): Promise<Material> {
    const { name, avgPrice, quantity } = input
    const data: Prisma.MaterialCreateInput = {
        name: name,
        avgPrice:avgPrice/quantity,
        quantity,
        openingStock:quantity,
        totalAmount:avgPrice,
    }
    let material: Material;
    try {
        material = await prisma.material.create({
            data
        });

        await prisma.transactionLog.create({
            data:{
                entityType:'MATERIAL',
                transactionType:'INWARD',
                quantity:data.quantity,
                totalAmount:avgPrice,
                units:quantity,
                description:`${data.quantity}kgs Material added as opening stock`,
                materialId:material.id
            }
        })

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
            }
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
    console.log('material-log add response: ',res);
    

    // const sumOfRemainingStock = await prisma.transactionLog.aggregate({
    //     _sum:{
    //         totalAmount:true,
    //         quantity:true,
    //     } ,
    //     where:{
    //         quantity:{
    //             not:0,
    //         },
    //         materialId:Number(params.entityId),
    //         entityType:{
    //             equals:'MATERIAL'
    //         }
    //     }
    // })

    // if(sumOfRemainingStock._sum.totalAmount && sumOfRemainingStock._sum.quantity ){
    //     const updatedAvgPrice = await prisma.material.update({
    //         data:{
    //             avgPrice:Number((sumOfRemainingStock._sum.totalAmount/sumOfRemainingStock._sum.quantity).toFixed(2)),
    //             quantity:sumOfRemainingStock._sum.quantity,
    //             totalAmount:sumOfRemainingStock._sum.totalAmount
    //         },
    //         where:{
    //             id:params.entityId
    //         }
    //     })
    //     console.log('updatedAvgPrice: ',updatedAvgPrice);
        

    // }

    const currentMaterialObj = await prisma.material.findUnique({
        where:{
            id:params.entityId
        }
    })

    console.log('currentMaterialObj : ',currentMaterialObj);

    
    


    if(currentMaterialObj ){

        const newTotalAmount = currentMaterialObj.totalAmount + (data.totalAmount?data.totalAmount:0);
        const newTotalQty = currentMaterialObj.quantity + (data.quantity?data.quantity:0);
        const newAvg = newTotalAmount/newTotalQty ;

        const updatedAvgPrice = await prisma.material.update({
            data:{
                avgPrice:Number((newAvg).toFixed(2)),
                quantity:Number(newTotalQty.toFixed()),
                totalAmount:Number(newTotalAmount.toFixed())
            },
            where:{
                id:params.entityId
            }
        })
        console.log('updatedAvgPrice: ',updatedAvgPrice);
        

    }
    console.log('addStocksToMaterialResponse: ', res);

    return res;
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