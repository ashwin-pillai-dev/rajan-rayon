'use server'
import { Chemical, Prisma } from '@prisma/client';
import prisma from '../../../lib/prisma';
import { chemicalFormType } from './add/chemicalSchema';
import { inwardTransactionFormType } from '../components/zodSchemas/inwardTransacrionSchema';






export async function addChemical(input: chemicalFormType):Promise<Chemical> {

    const { name, avgPrice,quantity } = input


    const data:Prisma.ChemicalCreateInput = {
        name: name,
        avgPrice:avgPrice/quantity,
        quantity,
        openingStock:quantity,
        totalAmount:avgPrice,

    }
    let chemical:Chemical;
    try {

        chemical = await prisma.chemical.create({
            data

        });

        await prisma.transactionLog.create({
            data:{
                entityType:'CHEMICAL',
                transactionType:'INWARD',
                quantity:data.quantity,
                totalAmount:avgPrice,
                units:quantity,
                description:`${data.quantity}kgs Chemical added as opening stock`,
                chemicalId:chemical.id
            }
        })

    return chemical;        

    } catch (error) {
        console.error('Error adding chemical:', error);
        throw error;
    }
}

export async function updateChemical(input: chemicalFormType,id:number):Promise<Chemical> {

    const { name, avgPrice,quantity } = input


    const data:Prisma.ChemicalUpdateInput= {
        name,
        avgPrice,
        quantity

    }
    let chemical:Chemical;
    try {

        chemical = await prisma.chemical.update({
            data,
            where:{id:id}

        });

    return chemical;        

    } catch (error) {
        console.error('Error adding chemical:', error);
        throw error;
    }
}


export type transactionWithChemical = Prisma.TransactionLogGetPayload<
    {
        include: {
            chemical: true,
            supplier: true,
        }
    }
>

export async function addStocksToChemical(params: inwardTransactionFormType) {
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
        chemical: {
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


    const res: transactionWithChemical = await prisma.transactionLog.create({
        data,
        include: {
            chemical: true,
            supplier: true,
        }
    }
    ) 
    console.log('Chemical-log add response: ',res);
    

    const currentChemicalObj = await prisma.chemical.findUnique({
        where:{
            id:params.entityId
        }
    })

    console.log('currentChemicalObj : ',currentChemicalObj);

    
    


    if(currentChemicalObj ){

        const newTotalAmount = currentChemicalObj.totalAmount + (data.totalAmount?data.totalAmount:0);
        const newTotalQty = currentChemicalObj.quantity + (data.quantity?data.quantity:0);
        const newAvg = newTotalAmount/newTotalQty ;

        const updatedAvgPrice = await prisma.chemical.update({
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
    console.log('addStocksToChemicalResponse: ', res);

    return res;
}